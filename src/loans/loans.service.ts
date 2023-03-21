import * as dayjs from 'dayjs';
import * as isBetween from 'dayjs/plugin/isBetween';
import * as utc from 'dayjs/plugin/utc';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Loan, Term, Prisma } from '@prisma/client';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { FilterDto, Loan as LoanDto, TransactionWithConcept } from '../models';
import { PrismaService } from '../database/prisma.service';
import { InterestCalculator } from '../helpers/interest-calculator';
import { ConceptEnumType } from '../models/enums';
import { StatementPDF } from 'src/helpers/statement-pdf';
import { ConfigType } from '@nestjs/config';
import configuration from '../config/configuration';
import { DateHelpers } from '../helpers/date-helpers';

dayjs.extend(isBetween);
dayjs.extend(utc);

@Injectable()
export class LoansService {
  constructor(
    @Inject(configuration.KEY)
    private configService: ConfigType<typeof configuration>,
    private prismaService: PrismaService,
  ) {}

  private getCreateUpdateData(params: LoanDto | UpdateLoanDto, userId: string) {
    const { amount, borrower1, borrower2, startDate, terms } = params;
    const initialTerm = terms[0];
    const { months, annualInterestRate, paymentAscConcepts } = initialTerm;

    const coBorrower = borrower2?.id ? borrower2 : undefined;

    const createdPaymentAscConcepts =
      paymentAscConcepts?.reduce((accum, item) => {
        return [
          ...accum,
          {
            amount: item.amount,
            concept: { connect: { id: item.concept.id } },
          },
        ];
      }, []) ?? [];

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
            paymentAscConcepts: {
              create: createdPaymentAscConcepts,
            },
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
    const { terms } = params;
    const initialTerm = terms[0];
    const { months } = initialTerm;
    data.balance = {
      create: {
        amountPaid: 0,
        amountToPrincipal: 0,
        amountToInterest: 0,
        amountInArrears: 0,
        amountLateFee: 0,
        latePayments: 0,
        installment: `0 of ${months}`,
      },
    };
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
            paymentAscConcepts: {
              select: {
                amount: true,
                concept: {
                  select: {
                    name: true,
                  },
                },
              },
            },
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
        balance: true,
      },
      orderBy: {
        borrower1: {
          lastName: 'asc',
        },
      },
    };

    if (name) {
      options.where = {
        OR: [
          {
            borrower1: {
              firstName: {
                contains: `${name}`,
              },
            },
          },
          {
            borrower1: {
              lastName: {
                contains: `${name}`,
              },
            },
          },
          {
            borrower1: {
              email: {
                contains: `${name}`,
              },
            },
          },
        ],
      };
    }

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
        terms: {
          orderBy: {
            beginToApplyDate: 'asc',
          },
          include: {
            paymentAscConcepts: {
              select: {
                amount: true,
                concept: {
                  select: {
                    id: true,
                    name: true,
                    conceptType: true,
                    isToThirdParty: true,
                  },
                },
              },
            },
          },
        },
        balance: true,
        borrower1: true,
        transactions: {
          include: { concept: true },
          orderBy: {
            date: 'asc',
          },
        },
      },
    });

    if (!loan) {
      throw new HttpException('Loan not found', HttpStatus.NOT_FOUND);
    }
    return loan;
  }

  async projection(
    where: Prisma.LoanWhereUniqueInput,
    additionalTransactions: TransactionWithConcept[] = [],
  ) {
    const loan = await this.findOne(where);

    const { transactions } = loan;

    const allTransactions = [...transactions, ...additionalTransactions];

    const { terms, amount, startDate } = loan;
    const term = terms[0];
    const { months, monthlyRate, cutOffDay, paymentAscConcepts, paymentDay } =
      term;

    const totalPaymentAscConcepts = paymentAscConcepts.reduce((total, item) => {
      return total + item.amount;
    }, 0);

    const installments = InterestCalculator.projectInstallments(
      monthlyRate,
      months,
      amount,
      startDate,
      paymentDay,
    );

    let initBalance = amount;
    let totalArrears = 0;
    let installmentsCount = 1;
    let pastDueInstallments = 0;
    let lastPaymentDate: dayjs.Dayjs = null;

    const paymentConceptId = this.configService.coreBusiness.paymentConceptId;
    const lateFeeConceptId = this.configService.coreBusiness.lateFeeConceptId;

    const data: API.ProjectionRow[] = [];

    for (const [currentIndex, installment] of installments.entries()) {
      if (initBalance <= 0) {
        break;
      }

      const [initDate, finalDate] = DateHelpers.getCutOffDates(
        installment.date,
        cutOffDay,
      );

      const monthTransactions = allTransactions.filter((trn) => {
        return DateHelpers.parse(trn.date).isBetween(
          initDate,
          finalDate,
          'day',
          '[]',
        );
      });

      const ideaPayment =
        installment.monthlyAmount + totalArrears + totalPaymentAscConcepts;

      let isThereAPayment: boolean = false;
      let lateFee = 0;

      const debits = monthTransactions
        .filter((trn) => trn.concept.conceptType === ConceptEnumType.DEBIT)
        .reduce((total, item) => {
          if (item.concept.id === lateFeeConceptId) {
            lateFee += item.amount;
          }
          return total + item.amount;
        }, 0);

      const credits = monthTransactions
        .filter((trn) => trn.concept.conceptType === ConceptEnumType.CREDIT)
        .reduce((total, item) => {
          if (item.concept.id === paymentConceptId) {
            isThereAPayment = true;
            lastPaymentDate = DateHelpers.parse(item.date);
          }
          return total + item.amount;
        }, 0);

      pastDueInstallments = isThereAPayment ? 0 : pastDueInstallments + 1;

      const appliedToInterest = initBalance * monthlyRate;
      const realAppliedToInterest =
        monthTransactions.length > 0 ? initBalance * monthlyRate : 0;
      const appliedToPrincipal =
        monthTransactions.length > 0
          ? credits - debits - appliedToInterest - totalPaymentAscConcepts
          : ideaPayment - appliedToInterest - totalPaymentAscConcepts;
      const realAppliedToPrincipal =
        monthTransactions.length > 0
          ? credits - debits - appliedToInterest - totalPaymentAscConcepts
          : 0;
      const endingBalance = initBalance - appliedToPrincipal;

      const row: API.ProjectionRow = {
        date: isThereAPayment
          ? lastPaymentDate.format('MM/DD/YYYY')
          : installment.date,
        initBalance,
        pastDueInstallments,
        lastPaymentDate: lastPaymentDate
          ? lastPaymentDate.format('MM/DD/YYYY')
          : '',
        ideaPayment,
        realPayment: credits,
        otherConcepts: totalPaymentAscConcepts - debits,
        appliedToInterest,
        realAppliedToInterest,
        appliedToPrincipal,
        realAppliedToPrincipal,
        endingBalance,
        totalArrears,
        lateFee,
        monthTransactions,
        installment: `${installmentsCount} of ${months}`,
      };

      totalArrears = isThereAPayment ? 0 : totalArrears + debits;

      initBalance = endingBalance;
      installmentsCount += 1;

      if (currentIndex === installments.length - 1 && endingBalance > 0) {
        const addedInstallmentDate = DateHelpers.parse(installment.date)
          .add(1, 'month')
          .format('MM/DD/YYYY');

        const addedInstallment: API.InstallmentRow = {
          date: addedInstallmentDate,
          beginning: 0,
          ending: 0,
          monthlyAmount: installment.monthlyAmount,
          toInterest: 0,
          toPrincipal: 0,
        };

        installments.push(addedInstallment);
      }

      data.push(row);
    }

    return data;
  }

  async generateStatement(where: Prisma.LoanWhereUniqueInput, date: string) {
    const projection = await this.projection(where);
    const loan = await this.findOne(where);

    const { terms } = loan;

    const term = terms[0];

    const currentStatement = projection.find((trn) =>
      DateHelpers.parse(trn.date).isSame(date, 'month'),
    );

    if (!currentStatement) {
      throw new HttpException(
        "Loan doesn't have information for this date",
        HttpStatus.NOT_FOUND,
      );
    }

    return StatementPDF.generate({ loan, projection, date, term });
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
      const { months, monthlyRate, paymentDay } = term;

      const installments = InterestCalculator.projectInstallments(
        monthlyRate,
        months,
        amount,
        startDate,
        paymentDay,
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
      return await this.prismaService.$transaction(async (prisma) => {
        await key.reduce(async (antPromise, item) => {
          await antPromise;
          const loan = await this.findOne({ id: item });

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
