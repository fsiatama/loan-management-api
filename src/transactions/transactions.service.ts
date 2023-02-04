import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Concept, Transaction, Prisma } from '@prisma/client';
import * as dayjs from 'dayjs';
import {
  FilterDto,
  MongoIdDto,
  Transaction as TransactionDto,
} from '../models';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { PrismaService } from '../database/prisma.service';
import { FilterTransactionDto } from './dto/filter-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(private prismaService: PrismaService) {}

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

  create(params: TransactionDto, userId: string) {
    const data = this.getCreateUpdateData(params, userId);
    return this.prismaService.transaction.create({
      data,
    });
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
    where: Prisma.LoanWhereUniqueInput;
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

  remove(where: Prisma.LoanWhereUniqueInput) {
    return this.prismaService.loan.delete({
      where,
    });
  }
}
