import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { LoansModule } from './loans/loans.module';
import { TermsModule } from './terms/terms.module';
import { TransactionsModule } from './transactions/transactions.module';
import { BorrowersModule } from './borrowers/borrowers.module';
import { ConceptsModule } from './concepts/concepts.module';

import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [configuration],
    }),
    AuthModule,
    UsersModule,
    LoansModule,
    TermsModule,
    TransactionsModule,
    BorrowersModule,
    ConceptsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
