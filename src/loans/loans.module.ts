import { Module } from '@nestjs/common';
import { LoansService } from './loans.service';
import { LoansController } from './loans.controller';
import { PrismaModule } from '../database/prisma.module';
import { TransactionsService } from '../transactions/transactions.service';

@Module({
  imports: [PrismaModule],
  controllers: [LoansController],
  providers: [LoansService, TransactionsService],
  exports: [LoansService],
})
export class LoansModule {}
