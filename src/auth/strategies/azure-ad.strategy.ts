import { PassportStrategy } from '@nestjs/passport';
import { ConfigType } from '@nestjs/config';
import { BearerStrategy } from 'passport-azure-ad';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import configuration from '../../config/configuration';

@Injectable()
export class AzureADStrategy extends PassportStrategy(
  BearerStrategy,
  'azure-ad',
) {
  constructor(
    @Inject(configuration.KEY) configService: ConfigType<typeof configuration>,
  ) {
    const azureADConfig = configService.azureAD;
    super({
      identityMetadata: `https://${azureADConfig.credentials.tenantName}.b2clogin.com/${azureADConfig.credentials.tenantName}.onmicrosoft.com/${azureADConfig.policies.policyName}/${azureADConfig.metadata.version}/${azureADConfig.metadata.discovery}`,
      clientID: azureADConfig.credentials.clientID,
      audience: azureADConfig.credentials.clientID,
      policyName: azureADConfig.policies.policyName,
      isB2C: azureADConfig.settings.isB2C,
      validateIssuer: azureADConfig.settings.validateIssuer,
      loggingLevel: azureADConfig.settings.loggingLevel,
      passReqToCallback: azureADConfig.settings.passReqToCallback,
    });
  }

  async validate(data: string): Promise<any> {
    console.log(data);

    if (!data) {
      throw new UnauthorizedException('Not allowed');
    }
    return data;
  }
}
