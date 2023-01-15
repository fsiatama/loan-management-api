import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { Client } from '@microsoft/microsoft-graph-client';
import { ConfigType } from '@nestjs/config';
import { ConfidentialClientApplication } from '@azure/msal-node';
import 'isomorphic-fetch';

import configuration from '../config/configuration';
import { MsGraphProvider } from './ms-graph-provider';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import util from './util/util';

@Injectable()
export class AzureB2cService {
  private readonly msGraphClient: Client;

  constructor(
    @Inject('MSAL') private msalClient: ConfidentialClientApplication,
    @Inject(configuration.KEY)
    private configService: ConfigType<typeof configuration>,
    @Inject(forwardRef((): typeof UsersService => UsersService))
    private usersService: UsersService,
  ) {
    const clientOptions = {
      authProvider: new MsGraphProvider(configService, msalClient),
    };

    this.msGraphClient = Client.initWithMiddleware(clientOptions);
  }

  private getAttributes(): string[] {
    const { extensionsClientId } = this.configService.azureMsal;
    const clientId = extensionsClientId.replace(/-/g, '');

    return [
      'displayName',
      'givenName',
      'surname',
      'mail',
      'preferredLanguage',
      'password',
      'id',
      `extension_${clientId}_sicexId`,
      `extension_${clientId}_userAuthorizeRenewal`,
      `extension_${clientId}_userCanDownloadReports`,
      `extension_${clientId}_userTemplate`,
      `extension_${clientId}_products`,
      `extension_${clientId}_userIp`,
      `extension_${clientId}_useMfa`,
    ];
  }

  private getUsername(user: User) {
    const userName = user.username.trim().toLowerCase().replace(/\*/g, '');
    return `${userName}@sicexapplication.onmicrosoft.com`;
  }

  async create(user: User) {
    const userToCreate = util.userDtoToAzureB2cDto(user);

    // console.log(userToCreate);

    try {
      return await this.msGraphClient.api('/users').post(userToCreate);
    } catch (error) {
      console.log(error);
      const body = JSON.parse(error.body);
      if (body) {
        throw new HttpException(
          `Error on Azure AD: ${body.message}`,
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new Error('Error on create user at Azure B');
    }
  }

  async findAll(): Promise<number | []> {
    try {
      console.log('Graph API called at: ' + new Date().toString());

      const result = await this.msGraphClient.api('/users').count().get();
      return Promise.resolve(result);
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async getUser(userPrincipalName: string): Promise<[] | boolean> {
    try {
      const attrib = this.getAttributes();
      return await this.msGraphClient
        .api(`/users/${userPrincipalName}`)
        .select(attrib)
        .get();
    } catch (error) {
      // console.log(error);
      return Promise.resolve(false);
    }
  }

  async listAttributes(): Promise<[]> {
    try {
      console.log('Graph API called at: ' + new Date().toString());
      return await this.msGraphClient.api('/identity/userFlowAttributes').get();
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async update(user: User) {
    try {
      const userPrincipalName = this.getUsername(user);

      const exist = await this.getUser(userPrincipalName);
      if (exist === false) {
        throw new HttpException(
          'User not exist in Azure B2C',
          HttpStatus.NOT_FOUND,
        );
      }
      const userToUpdate = util.userDtoToAzureB2cDto(user);

      return await this.msGraphClient
        .api(`/users/${userPrincipalName}`)
        .patch(userToUpdate);
    } catch (error) {
      console.log(error);
      const body = JSON.parse(error.body);
      if (body) {
        throw new HttpException(
          `Error on Azure AD: ${body.message}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      throw error;
    }
  }

  async remove(user: User) {
    try {
      const userPrincipalName = this.getUsername(user);
      return await this.msGraphClient
        .api(`/users/${userPrincipalName}`)
        .delete();
    } catch (error) {
      const body = JSON.parse(error.body);
      console.log(body);
      if (body.code !== 'Request_ResourceNotFound') {
        throw error;
      } else if (body) {
        throw new HttpException(
          `Error on Azure AD: ${body.message}`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  async bulkCreate(data: any[]) {
    try {
      console.log('Graph API called at: ' + new Date().toString());
      Promise.all(
        data.map(async (auth0User) => {
          const user: User = await this.usersService.findOne(auth0User.userID);
          if (user && user.email) {
            const userName = user.username
              .trim()
              .toLowerCase()
              .replace(/\*/g, '');

            const email = user.email.trim().toLowerCase();

            const exist = await this.getUser(
              `${userName}@sicexapplication.onmicrosoft.com`,
            );

            if (exist === false) {
              console.log(userName, user.username);

              const b2cUser = {
                city: user.city || '-',
                country: user?.country ? user.country.name : '-',
                accountEnabled: true,
                displayName: `${user.name} ${user.lastName}`,
                givenName: user.name,
                mailNickname: userName,
                passwordPolicies:
                  'DisablePasswordExpiration, DisableStrongPassword',
                passwordProfile: {
                  password: user.password,
                  forceChangePasswordNextSignIn: false,
                },
                preferredLanguage: user.langId === 1 ? 'es-ES' : 'en-US',
                surname: user.lastName,
                mobilePhone: user.phone || '-',
                //mail: email,
                extension_8d38b29e7095428ebef627e928b8f7ce_sicexId: `${user.id}`,
                identities: [
                  {
                    signInType: 'userName',
                    issuer: 'sicexapplication.onmicrosoft.com',
                    issuerAssignedId: userName,
                  },
                ],
                userPrincipalName: `${userName}@sicexapplication.onmicrosoft.com`,
                extension_8d38b29e7095428ebef627e928b8f7ce_useMfa:
                  user.useMfa === true ? true : false,
              };

              const result = await this.msGraphClient
                .api('/users')
                .post(b2cUser);

              console.log(result, b2cUser);
            }
          }
        }),
      );
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
