import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Loan, Prisma } from '@prisma/client';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { FilterDto, Loan as LoanDto } from '../models';
import { PrismaService } from '../database/prisma.service';
import { InterestCalculator } from '../helpers/interest-calculator';

@Injectable()
export class LoansService {
  constructor(private prismaService: PrismaService) {}

  create(params: LoanDto, userId: string) {
    const { amount, borrower1, borrower2, startDate, terms } = params;
    const { months, annualInterestRate } = terms;

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
            ...terms,
            beginToApplyDate: startDate,
            monthlyAmount,
            monthlyRate,
            uinsert: { connect: { id: userId } },
          },
        ],
      },
      borrower1: { connect: borrower1 },
      borrower2: { connect: borrower2 },
      uinsert: { connect: { id: userId } },
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
            firstName: true,
            lastName: true,
          },
        },
        borrower2: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    };

    const borrowerCount = await this.prismaService.loan.count();

    const result: Partial<Loan>[] = await this.prismaService.loan.findMany(
      options,
    );

    return {
      data: result,
      current,
      pageSize,
      success: true,
      total: borrowerCount,
    };
  }

  async findOne(where: Prisma.LoanWhereUniqueInput) {
    const loan = await this.prismaService.loan.findUnique({
      where,
      include: {
        terms: true,
      },
    });

    if (!loan) {
      throw new HttpException('Borrower not found', HttpStatus.NOT_FOUND);
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

  update(id: number, updateLoanDto: UpdateLoanDto) {
    return `This action updates a #${id} loan`;
  }

  remove(id: number) {
    return `This action removes a #${id} loan`;
  }
}
