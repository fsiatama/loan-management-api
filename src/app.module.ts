import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CountriesModule } from './countries/countries.module';
import { ProductsModule } from './products/products.module';
import { SuscriptionsModule } from './suscriptions/suscriptions.module';
import { AzureB2cModule } from './azure-b2c/azure-b2c.module';

import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [configuration],
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    CountriesModule,
    ProductsModule,
    SuscriptionsModule,
    AzureB2cModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
