import * as dayjs from 'dayjs';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Loan, Term, Prisma } from '@prisma/client';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { FilterDto, Loan as LoanDto } from '../models';
import { PrismaService } from '../database/prisma.service';
import { InterestCalculator } from '../helpers/interest-calculator';

@Injectable()
export class LoansService {
  constructor(private prismaService: PrismaService) {}

  private getCreateUpdateData(params: LoanDto | UpdateLoanDto, userId: string) {
    const { amount, borrower1, borrower2, startDate, terms } = params;
    const initialTerm = terms[0];
    const { months, annualInterestRate } = initialTerm;

    const coBorrower = borrower2.id ? borrower2 : undefined;

    const monthlyRate =
      InterestCalculator.calculateMonthlyRate(annualInterestRate);

    const monthlyAmount = InterestCalculator.calculateMonthlyAmount(
      monthlyRate,
      months,
      amount,
    );

    const data: Prisma.LoanCreateInput = {
      amount,
      startDate,
      terms: {
        create: [
          {
            ...initialTerm,
            beginToApplyDate: startDate,
            monthlyAmount,
            monthlyRate,
            uinsert: { connect: { id: userId } },
          },
        ],
      },
      borrower1: { connect: borrower1 },
      borrower2: { connect: coBorrower },
      uinsert: { connect: { id: userId } },
    };

    return data;
  }

  create(params: LoanDto, userId: string) {
    const data = this.getCreateUpdateData(params, userId);
    return this.prismaService.loan.create({
      data,
    });
  }

  async findAll(params?: FilterDto) {
    const { pageSize = 20, current = 1, name } = params;

    const options: {
      skip?: number;
      take?: number;
      cursor?: Prisma.LoanWhereUniqueInput;
      where?: Prisma.LoanWhereInput;
      orderBy?: Prisma.LoanOrderByWithRelationInput;
      select: Prisma.LoanSelect;
    } = {
      take: pageSize,
      skip: (current - 1) * pageSize,
      select: {
        id: true,
        amount: true,
        startDate: true,
        uinsert: {
          select: {
            name: true,
            id: true,
          },
        },
        terms: {
          select: {
            months: true,
            annualInterestRate: true,
            beginToApplyDate: true,
            cutOffDay: true,
            paymentDay: true,
            latePaymentFee: true,
            monthlyAmount: true,
            monthlyRate: true,
          },
          orderBy: {
            beginToApplyDate: 'desc',
          },
        },
        borrower1: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            address: {
              select: {
                phone: true,
              },
            },
          },
        },
        borrower2: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    };

    const count = await this.prismaService.loan.count();

    const result: Partial<Loan>[] = await this.prismaService.loan.findMany(
      options,
    );

    return {
      data: result,
      current,
      pageSize,
      success: true,
      total: count,
    };
  }

  async findOne(where: Prisma.LoanWhereUniqueInput) {
    const loan = await this.prismaService.loan.findUnique({
      where,
      include: {
        terms: true,
        borrower1: true,
        transactions: true,
      },
    });

    if (!loan) {
      throw new HttpException('Loan not found', HttpStatus.NOT_FOUND);
    }
    return loan;
  }

  async projection(where: Prisma.LoanWhereUniqueInput) {
    const loan = await this.prismaService.loan.findUnique({
      where,
      include: {
        terms: true,
      },
    });

    if (!loan) {
      throw new HttpException('Borrower not found', HttpStatus.NOT_FOUND);
    }

    const { terms, amount, startDate } = loan;
    const term = terms[0];
    const { months, monthlyRate } = term;

    const installments = InterestCalculator.projectInstallments(
      monthlyRate,
      months,
      amount,
      startDate,
    );
    // console.log(installments);

    return installments;
  }

  async getStatistics() {
    const count = await this.prismaService.loan.count();

    type LoanType = Loan & {
      terms: Term[];
    };

    const loans: LoanType[] = await this.prismaService.loan.findMany({
      include: {
        terms: true,
        borrower1: true,
        transactions: true,
      },
    });

    const currentMonth = dayjs();
    const previousMonth = currentMonth.subtract(1, 'month');

    let currentMonthCount = 0;
    let previousMonthCount = 0;
    let currentMonthTotal = 0;
    let previousMonthTotal = 0;

    for (let loan of loans) {
      const { terms, amount, startDate } = loan;
      const term = terms[0];
      const { months, monthlyRate } = term;

      const installments = InterestCalculator.projectInstallments(
        monthlyRate,
        months,
        amount,
        startDate,
      );

      const currentMonthPayment = installments.find((item) =>
        currentMonth.isSame(item.date, 'month'),
      );
      if (currentMonthPayment) {
        currentMonthCount += 1;
        currentMonthTotal += currentMonthPayment.monthlyAmount;
      }
      const previousMonthPayment = installments.find((item) =>
        previousMonth.isSame(item.date, 'month'),
      );
      if (previousMonthPayment) {
        previousMonthCount += 1;
        previousMonthTotal += previousMonthPayment.monthlyAmount;
      }
    }

    return [
      {
        id: 1,
        value: currentMonthCount,
        prevValue: previousMonthCount,
        unit: 'Ls',
      },
      {
        id: 2,
        value: currentMonthTotal,
        prevValue: previousMonthTotal,
        unit: '$',
      },
    ];

    const statistics = loans.reduce(
      (accum: API.ComparativeStatistic[], loan: LoanType) => {
        const statistic: API.ComparativeStatistic = {
          id: 1,
          value: 45,
          prevValue: 30,
          unit: 'kg',
        };
        return [...accum, statistic];
      },
      [],
    );

    return statistics;
  }

  async update(params: {
    where: Prisma.LoanWhereUniqueInput;
    data: UpdateLoanDto;
    userId: string;
  }) {
    const { data, where, userId } = params;
    try {
      await this.findOne(where);
      return await this.prismaService.$transaction(async (prisma) => {
        await this.prismaService.term.deleteMany({
          where: {
            loanId: where.id,
          },
        });

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

  private async remove(where: Prisma.LoanWhereUniqueInput): Promise<Loan> {
    return this.prismaService.loan.delete({
      where,
    });
  }

  async batchRemove({ key }: { key: string[] }) {
    try {
      return await this.prismaService.$transaction(async () => {
        await key.reduce(async (antPromise, item) => {
          await antPromise;
          const loan = await this.findOne({ id: item });

          await this.prismaService.term.deleteMany({
            where: {
              loanId: item,
            },
          });

          const { transactions } = loan;
          if (transactions.length > 0) {
            throw new HttpException(
              `The loan by ${loan.amount} for borrower : ${loan.borrower1.firstName} ${loan.borrower1.lastName}, has associated information and cannot be deleted.`,
              HttpStatus.PRECONDITION_FAILED,
            );
          }

          await this.remove({ id: item });
        }, Promise.resolve());
      });
    } catch (err) {
      console.log('Delete Borrowers transaction failed');
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
}
