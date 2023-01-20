import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ClientsModule } from './clients/clients.module';
import { LoansModule } from './loans/loans.module';
import { BalancesModule } from './balances/balances.module';
import { TermsModule } from './terms/terms.module';
import { TransactionsModule } from './transactions/transactions.module';
import { TransactionTypesModule } from './transaction-types/transaction-types.module';

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
    ClientsModule,
    LoansModule,
    BalancesModule,
    TermsModule,
    TransactionsModule,
    TransactionTypesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
