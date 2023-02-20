import { ConfigType } from '@nestjs/config';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { Transaction, Prisma, Concept } from '@prisma/client';
import * as dayjs from 'dayjs';
import { Transaction as TransactionDto } from '../models';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { PrismaService } from '../database/prisma.service';
import { FilterTransactionDto } from './dto/filter-transaction.dto';
import { LoansService } from '../loans/loans.service';
import configuration from '../config/configuration';
import { DateHelpers } from '../helpers/date-helpers';

@Injectable()
export class TransactionsService {
  constructor(
    @Inject(configuration.KEY)
    private configService: ConfigType<typeof configuration>,
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
      date,
      loan: { connect: { id: loan.id } },
      concept: { connect: concept },
      uinsert: { connect: { id: userId } },
    };

    return data;
  }

  private async getSumTransactionsByConceptAndMonth(
    currentDate: string,
    conceptId: string,
    cutOffDay: number,
    transactions: (Transaction & { concept: Concept })[],
  ) {
    const [initDate, finalDate] = DateHelpers.getCutOffDates(
      currentDate,
      cutOffDay,
    );

    return transactions
      .filter((trn) =>
        dayjs(trn.date).isBetween(initDate, finalDate, 'day', '[)'),
      )
      .reduce((total, item) => {
        return total + item.amount;
      }, 0);

    // console.log(currentDate, initDate.toISOString(), finalDate.toISOString());

    /*return this.prismaService.transaction.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        concept: { id: conceptId },
        date: {
          gte: initDate.toISOString(),
          lte: finalDate.toISOString(),
        },
      },
    });*/
  }

  async create(params: TransactionDto, userId: string) {
    try {
      const { loan: loanId, date, concept } = params;
      const loan = await this.loanService.findOne({ id: loanId.id });
      const { transactions, terms } = loan;

      const lastTerm = terms.pop();
      const { paymentAscConcepts, cutOffDay } = lastTerm;

      let transactionsToCreate = [];

      const paymentConceptId = this.configService.coreBusiness.paymentConceptId;

      let remainingAmount = params.amount;
      if (concept.id === paymentConceptId) {
        const othersTransactionsConcepts = await paymentAscConcepts.reduce(
          async (accum, item) => {
            const arrOthersConcepts = await accum;
            const previousPayments =
              await this.getSumTransactionsByConceptAndMonth(
                date.toISOString(),
                item.concept.id,
                cutOffDay,
                transactions,
              );

            if (previousPayments < item.amount) {
              const ideaPayment = item.amount - previousPayments;
              const splitAmount =
                remainingAmount >= ideaPayment ? ideaPayment : remainingAmount;

              if (remainingAmount > 0) {
                const row: Prisma.TransactionCreateInput = {
                  amount: splitAmount,
                  description: `${item.concept.name} ${params.description}`,
                  date,
                  loan: { connect: { id: loan.id } },
                  concept: { connect: { id: item.concept.id } },
                  uinsert: { connect: { id: userId } },
                };

                remainingAmount -= splitAmount;

                return [...arrOthersConcepts, row];
              }
            }
            return [];
          },
          Promise.resolve([] as Prisma.TransactionCreateInput[]),
        );

        transactionsToCreate = othersTransactionsConcepts
          ? [...othersTransactionsConcepts]
          : [];
      }

      if (remainingAmount > 0) {
        const newTransaction = {
          amount: remainingAmount,
          description: params.description,
          date,
          loan: { connect: { id: loan.id } },
          concept: { connect: concept },
          uinsert: { connect: { id: userId } },
        };
        transactionsToCreate.push(newTransaction);
      }

      return await this.prismaService.$transaction(async (prisma) => {
        await transactionsToCreate.reduce(async (prevPromise, item) => {
          await prevPromise;
          await this.prismaService.transaction.create({
            data: item,
          });
        }, Promise.resolve());
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
