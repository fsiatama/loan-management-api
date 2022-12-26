import { Inject, Injectable } from '@nestjs/common';
import { Client } from '@microsoft/microsoft-graph-client';
import { ConfigType } from '@nestjs/config';
import { ConfidentialClientApplication } from '@azure/msal-node';
import 'isomorphic-fetch';

import configuration from '../config/configuration';
import { CreateAzureB2cDto } from './dto/create-azure-b2c.dto';
import { UpdateAzureB2cDto } from './dto/update-azure-b2c.dto';
import { MsGraphProvider } from './ms-graph-provider';

@Injectable()
export class AzureB2cService {
  private readonly msGraphClient: Client;

  constructor(
    @Inject('MSAL') private msalClient: ConfidentialClientApplication,
    @Inject(configuration.KEY)
    private configService: ConfigType<typeof configuration>,
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
      `extension_${clientId}_userAuthorizeRenewal`,
      `extension_${clientId}_userCanDownloadReports`,
      `extension_${clientId}_userTemplate`,
      `extension_${clientId}_products`,
      `extension_${clientId}_userIp`,
      `extension_${clientId}_useMfa`,
    ];
  }

  async create(createAzureB2cDto: CreateAzureB2cDto) {
    const userToCreate = {
      accountEnabled: true,
      displayName: 'Adele B',
      // userPrincipalName: 'AdeleV@msaljsb2c.onmicrosoft.com',
      mailNickname: 'AdeleB',
      extension_8d38b29e7095428ebef627e928b8f7ce_userAuthorizeRenewal: true,
      extension_8d38b29e7095428ebef627e928b8f7ce_userCanDownloadReports: true,
      extension_8d38b29e7095428ebef627e928b8f7ce_userTemplate: '',
      extension_8d38b29e7095428ebef627e928b8f7ce_userIp: '',
      extension_8d38b29e7095428ebef627e928b8f7ce_products: '',
      extension_8d38b29e7095428ebef627e928b8f7ce_useMfa: false,
      identities: [
        {
          signInType: 'userName',
          issuer: 'sicexapplication.onmicrosoft.com',
          issuerAssignedId: 'adeleB',
        },
      ],
      passwordProfile: {
        password: 'xWwvJ]6NMw+bWH-d',
        forceChangePasswordNextSignIn: false,
      },
      passwordPolicies: 'DisablePasswordExpiration',
    };

    try {
      console.log('Graph API called at: ' + new Date().toString());
      return await this.msGraphClient.api('/users').post(userToCreate);
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async findAll(): Promise<[]> {
    try {
      console.log('Graph API called at: ' + new Date().toString());

      return await this.msGraphClient
        .api('/users')
        .select(this.getAttributes())
        .get();
    } catch (error) {
      console.log(error);
      return error;
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

  findOne(id: number) {
    return `This action returns a #${id} azureB2c`;
  }

  update(id: number, updateAzureB2cDto: UpdateAzureB2cDto) {
    return `This action updates a #${id} azureB2c`;
  }

  remove(id: number) {
    return `This action removes a #${id} azureB2c`;
  }
}
