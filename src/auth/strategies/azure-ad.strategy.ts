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
    super({
      identityMetadata: `https://${configService.credentials.tenantName}.b2clogin.com/${configService.credentials.tenantName}.onmicrosoft.com/${configService.policies.policyName}/${configService.metadata.version}/${configService.metadata.discovery}`,
      clientID: configService.credentials.clientID,
      audience: configService.credentials.clientID,
      policyName: configService.policies.policyName,
      isB2C: configService.settings.isB2C,
      validateIssuer: configService.settings.validateIssuer,
      loggingLevel: configService.settings.loggingLevel,
      passReqToCallback: configService.settings.passReqToCallback,
    });
  }

  async validate(data: string): Promise<any> {
    if (!data) {
      throw new UnauthorizedException('Not allowed');
    }
    return data;
  }
}
