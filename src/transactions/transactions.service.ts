import { ConfigType } from '@nestjs/config';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Transaction, Prisma } from '@prisma/client';
import * as dayjs from 'dayjs';
import { PrismaService } from '../database/prisma.service';
import { BalanceService } from '../balance/balance.service';
import { LoansService } from '../loans/loans.service';
import {
  Transaction as TransactionDto,
  TransactionWithConcept,
  LoanWithTerms,
  Balance,
} from '../models';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { FilterTransactionDto } from './dto/filter-transaction.dto';
import configuration from '../config/configuration';
import { DateHelpers } from '../helpers/date-helpers';

@Injectable()
export class TransactionsService {
  constructor(
    @Inject(configuration.KEY)
    private configService: ConfigType<typeof configuration>,
    private balanceService: BalanceService,
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
    transactions: TransactionWithConcept[],
  ) {
    const [initDate, finalDate] = DateHelpers.getCutOffDates(
      currentDate,
      cutOffDay,
    );

    return transactions
      .filter(
        (trn) =>
          dayjs(trn.date).isBetween(initDate, finalDate, 'day', '[)') &&
          trn.concept.id === conceptId,
      )
      .reduce((total, item) => {
        return total + item.amount;
      }, 0);
  }

  private async getTransactionsToCreate(
    loan: LoanWithTerms,
    params: TransactionDto,
    userId: string,
  ) {
    const { date, concept } = params;

    const { transactions, terms } = loan;

    const lastTerm = terms.pop();
    const { paymentAscConcepts, cutOffDay } = lastTerm;
    let transactionsToCreate = [];

    const paymentConceptId = this.configService.coreBusiness.paymentConceptId;

    let remainingAmount = params.amount;
    if (concept.id === paymentConceptId) {
      for (const item of paymentAscConcepts) {
        const previousPayments = await this.getSumTransactionsByConceptAndMonth(
          date.toISOString(),
          item.concept.id,
          cutOffDay,
          transactions,
        );

        if (previousPayments >= item.amount) {
          continue;
        }

        const ideaPayment = item.amount - previousPayments;
        const splitAmount =
          remainingAmount >= ideaPayment ? ideaPayment : remainingAmount;

        if (remainingAmount <= 0) {
          break;
        }

        const transaction = {
          amount: splitAmount,
          description: `${item.concept.name} ${params.description}`,
          date,
          loan: { connect: { id: loan.id } },
          concept: { connect: { id: item.concept.id } },
          uinsert: { connect: { id: userId } },
        };

        transactionsToCreate.push(transaction);

        remainingAmount -= splitAmount;
      }
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

    return transactionsToCreate;
  }

  async createBalanceOnlyDev() {
    try {
      const result = await this.prismaService.loan.findMany({
        select: {
          id: true,
          terms: true,
        },
      });
      return await this.prismaService.$transaction(
        async (prisma) => {
          const newBalances = await result.reduce(async (prevPromise, loan) => {
            await prevPromise;

            const projection = await this.loanService.projection({
              id: loan.id,
            });

            const { terms } = loan;
            const initialTerm = terms[0];
            let { months } = initialTerm;

            let amountLateFee = 0;
            let installment = `0 of ${months}`;
            let amountPaid = 0;
            let amountToPrincipal = 0;
            let amountToInterest = 0;
            let amountInArrears = 0;
            let latePayments = 0;
            let lastPaymentDate = null;

            for (const item of projection) {
              const {
                installment: inst,
                realPayment,
                realAppliedToInterest,
                realAppliedToPrincipal,
                lateFee,
                lastPaymentDate: lp,
                totalArrears,
                monthTransactions,
              } = item;

              if (!monthTransactions.length) {
                continue;
              }

              latePayments += totalArrears > 0 ? 1 : 0;

              amountPaid += realPayment;
              amountToPrincipal += realAppliedToPrincipal;
              amountToInterest += realAppliedToInterest;
              amountInArrears = totalArrears;
              amountLateFee += lateFee;
              lastPaymentDate = dayjs(lp).toISOString();
              installment = inst;
            }

            const balance = {
              amountPaid,
              amountToPrincipal,
              amountToInterest,
              amountInArrears,
              amountLateFee,
              latePayments,
              lastPaymentDate,
              installment,
              loan: { connect: { id: loan.id } },
            };

            await prisma.balance.create({
              data: balance,
            });

            return [];
          }, Promise.resolve([]));
        },
        {
          maxWait: 105000, // default: 2000
          timeout: 1010000, // default: 5000
        },
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  private async updateBalance(
    loan: LoanWithTerms,
    newTransactions: TransactionWithConcept[],
  ) {
    const projection = await this.loanService.projection(
      { id: loan.id },
      newTransactions,
    );

    let amountLateFee = 0;
    let installment = '';
    let amountPaid = 0;
    let amountToPrincipal = 0;
    let amountToInterest = 0;
    let amountInArrears = 0;
    let latePayments = 0;
    let lastPaymentDate = null;

    for (const item of projection) {
      const {
        installment: inst,
        realPayment,
        realAppliedToInterest,
        realAppliedToPrincipal,
        lateFee,
        lastPaymentDate: lp,
        totalArrears,
        monthTransactions,
      } = item;

      if (!monthTransactions.length) {
        continue;
      }

      latePayments += totalArrears > 0 ? 1 : 0;

      amountPaid += realPayment;
      amountToPrincipal += realAppliedToPrincipal;
      amountToInterest += realAppliedToInterest;
      amountInArrears = totalArrears;
      amountLateFee += lateFee;
      lastPaymentDate = dayjs(lp).toISOString();
      installment = inst;
    }

    const balance: Balance = {
      amountPaid,
      amountToPrincipal,
      amountToInterest,
      amountInArrears,
      amountLateFee,
      latePayments,
      lastPaymentDate,
      installment,
      loan: { id: loan.id },
    };

    return this.balanceService.update({
      where: { loanId: loan.id },
      data: balance,
    });

    /*const paymentConceptId = this.configService.coreBusiness.paymentConceptId;
    const lateFeeConceptId = this.configService.coreBusiness.lateFeeConceptId;

    let debits = 0;
    let credits = 0;
    let amountLateFee = 0;
    let amountThirdParty = 0;
    let lastPaymentDate: dayjs.Dayjs = null;

    for (const trn of allTransactions) {
      if (trn.concept.conceptType === ConceptEnumType.CREDIT) {
        credits += trn.amount;
        if (trn.concept.id === paymentConceptId) {
          lastPaymentDate = dayjs(trn.date);
        }
        if (trn.concept.isToThirdParty) {
          amountThirdParty += trn.amount;
        }
      }

      if (trn.concept.conceptType === ConceptEnumType.DEBIT) {
        debits += trn.amount;
        if (trn.concept.id === lateFeeConceptId) {
          amountLateFee += trn.amount;
        }
      }
    }

    const realPayment = credits - debits - amountThirdParty;

    const appliedToInterest = realPayment * (annualInterestRate / 100);
    //  const appliedToPrincipal =
    */
  }

  async create(params: TransactionDto, userId: string) {
    try {
      const { loan: loanId } = params;
      const loan = await this.loanService.findOne({ id: loanId.id });
      const transactionsToCreate = await this.getTransactionsToCreate(
        loan,
        params,
        userId,
      );

      return await this.prismaService.$transaction(async (prisma) => {
        const newTransactions = await transactionsToCreate.reduce(
          async (prevPromise, item) => {
            const prevTrx = await prevPromise;
            const trn = await prisma.transaction.create({
              data: item,
            });

            const trx = await prisma.transaction.findFirst({
              where: { id: trn.id },
              include: {
                concept: true,
              },
            });
            return [...prevTrx, trx];
          },
          Promise.resolve([] as TransactionWithConcept[]),
        );

        return this.updateBalance(loan, newTransactions);
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
