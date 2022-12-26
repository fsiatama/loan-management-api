import { Injectable, Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { ConfidentialClientApplication } from '@azure/msal-node';
import configuration from '../config/configuration';

@Injectable()
export class MsGraphProvider {
  constructor(
    @Inject(configuration.KEY)
    private configService: ConfigType<typeof configuration>,
    @Inject('MSAL') private msalClient: ConfidentialClientApplication,
  ) {}

  async getAccessToken(): Promise<string> {
    return new Promise(async (resolve, reject) => {
      const authResponse = await this.msalClient.acquireTokenByClientCredential(
        this.configService.azureMsal.tokenRequest,
      );

      if (authResponse.accessToken && authResponse.accessToken.length !== 0) {
        resolve(authResponse.accessToken);
      } else {
        reject(Error('Error: cannot obtain access token.'));
      }
    });
  }
}
