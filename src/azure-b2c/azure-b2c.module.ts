import { Module } from '@nestjs/common';
import { ConfidentialClientApplication } from '@azure/msal-node';
import { ConfigType } from '@nestjs/config';

import { AzureB2cService } from './azure-b2c.service';
import { AzureB2cController } from './azure-b2c.controller';
import { MsGraphProvider } from './ms-graph-provider';
import configuration from '../config/configuration';

@Module({
  controllers: [AzureB2cController],
  providers: [
    {
      provide: 'MSAL',
      useFactory: (configService: ConfigType<typeof configuration>) => {
        const client = new ConfidentialClientApplication(
          configService.azureMsal,
        );
        return client;
      },
      inject: [configuration.KEY],
    },
    MsGraphProvider,
    AzureB2cService,
  ],
})
export class AzureB2cModule {}
