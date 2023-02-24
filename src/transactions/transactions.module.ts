import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { PrismaModule } from '../database/prisma.module';
import { BalanceModule } from '../balance/balance.module';
import { LoansModule } from '../loans/loans.module';

@Module({
  imports: [PrismaModule, BalanceModule, LoansModule],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
