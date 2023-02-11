import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { Transaction, Prisma } from '@prisma/client';
import * as dayjs from 'dayjs';
import { Transaction as TransactionDto } from '../models';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { PrismaService } from '../database/prisma.service';
import { FilterTransactionDto } from './dto/filter-transaction.dto';
import { LoansService } from 'src/loans/loans.service';

@Injectable()
export class TransactionsService {
  constructor(
    @Inject(forwardRef(() => LoansService))
    private loanService: LoansService,
    private prismaService: PrismaService,
  ) {}

  private getCreateUpdateData(
    params: TransactionDto | UpdateTransactionDto,
    userId: string,
  ) {
    const { amount, concept, description, loan, date } = params;

    const data: Prisma.TransactionCreateInput = {
      amount,
      description,
      appliedToInterest: 0,
      appliedToPrincipal: 0,
      endingBalance: 0,
      date,
      loan: { connect: { id: loan.id } },
      concept: { connect: concept },
      uinsert: { connect: { id: userId } },
    };

    return data;
  }

  async create(params: TransactionDto, userId: string) {
    try {
      const { loan: loanId, date, concept } = params;
      const loan = await this.loanService.findOne({ id: loanId.id });
      const { transactions, terms, amount } = loan;

      const lastTerm = terms.pop();
      const { monthlyRate } = lastTerm;
      let [appliedToInterest, appliedToPrincipal, endingBalance] = [0, 0, 0];
      const lastTransaction = transactions.pop();

      if (lastTransaction) {
        const isBefore = dayjs(date).isBefore(lastTransaction.date, 'day');
        if (isBefore) {
          throw new HttpException(
            'You are unable to create this transaction as there are already transactions for this loan with later dates',
            HttpStatus.PRECONDITION_FAILED,
          );
        }
        appliedToInterest = lastTransaction.endingBalance * monthlyRate;
        appliedToPrincipal = params.amount - appliedToInterest;
        endingBalance = lastTransaction.endingBalance - appliedToPrincipal;
      } else {
        appliedToInterest = amount * monthlyRate;
        appliedToPrincipal = params.amount - appliedToInterest;
        endingBalance = amount - appliedToPrincipal;
      }
      const newTransaction: Prisma.TransactionCreateInput = {
        amount: params.amount,
        description: params.description,
        date,
        appliedToInterest,
        appliedToPrincipal,
        endingBalance,
        loan: { connect: { id: loan.id } },
        concept: { connect: concept },
        uinsert: { connect: { id: userId } },
      };

      //return { monthlyRate, amount, newTransaction };

      return await this.prismaService.$transaction(async (prisma) => {
        //const data = this.getCreateUpdateData(newTransaction, userId);

        return this.prismaService.transaction.create({
          data: newTransaction,
        });
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(params: FilterTransactionDto) {
    const { pageSize = 20, current = 1, name, loanId } = params;

    const options: {
      skip?: number;
      take?: number;
      cursor?: Prisma.TransactionWhereUniqueInput;
      where?: Prisma.TransactionWhereInput;
      orderBy?: Prisma.TransactionOrderByWithRelationInput;
      select: Prisma.TransactionSelect;
    } = {
      take: pageSize,
      skip: (current - 1) * pageSize,
      select: {
        id: true,
        amount: true,
        date: true,
        appliedToInterest: true,
        appliedToPrincipal: true,
        endingBalance: true,
        uinsert: {
          select: {
            name: true,
            id: true,
          },
        },
        loan: {
          select: {
            id: true,
          },
        },
        concept: {
          select: {
            id: true,
            name: true,
            isToThirdParty: true,
            conceptType: true,
          },
        },
      },
    };

    options.where = { loanId };

    const count = await this.prismaService.transaction.count();

    const result: Partial<Transaction>[] =
      await this.prismaService.transaction.findMany(options);

    return {
      data: result,
      current,
      pageSize,
      success: true,
      total: count,
    };
  }

  async findOne(where: Prisma.TransactionWhereUniqueInput) {
    const transaction = await this.prismaService.transaction.findUnique({
      where,
      include: {
        concept: true,
      },
    });

    if (!transaction) {
      throw new HttpException('Transaction not found', HttpStatus.NOT_FOUND);
    }
    return transaction;
  }

  async update(params: {
    where: Prisma.TransactionWhereUniqueInput;
    data: UpdateTransactionDto;
    userId: string;
  }) {
    const { data, where, userId } = params;
    try {
      await this.findOne(where);
      return await this.prismaService.$transaction(async (prisma) => {
        const mongoData = this.getCreateUpdateData(data, userId);

        return this.prismaService.loan.update({
          data: mongoData,
          where,
        });
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  remove(where: Prisma.TransactionWhereUniqueInput) {
    return this.prismaService.loan.delete({
      where,
    });
  }
}
