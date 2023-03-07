import { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { Balance } from '../models';
import { PrismaService } from '../database/prisma.service';
import { DateHelpers } from '../helpers/date-helpers';

@Injectable()
export class BalanceService {
  constructor(private prismaService: PrismaService) {}

  async getStatistics() {
    const balanceData = await this.prismaService.balance.aggregate({
      _sum: {
        amountPaid: true,
        amountToPrincipal: true,
        amountToInterest: true,
        amountInArrears: true,
        amountLateFee: true,
      },
      _count: {
        id: true,
      },
    });

    const loansData = await this.prismaService.loan.aggregate({
      _sum: {
        amount: true,
      },
    });

    const { _sum, _count } = balanceData;
    const { _sum: loansSum } = loansData;
    const detailed = await this.findAll();

    return {
      ..._sum,
      activeBorrowers: _count.id,
      loansAmount: loansSum.amount,
      detailed,
    };
  }

  async findAll() {
    const data = await this.prismaService.balance.findMany({
      select: {
        amountInArrears: true,
        amountLateFee: true,
        amountPaid: true,
        amountToInterest: true,
        amountToPrincipal: true,
        installment: true,
        lastPaymentDate: true,
        loan: {
          select: {
            id: true,
            amount: true,
            borrower1: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    return data.reduce((accum, item) => {
      const {
        lastPaymentDate,
        loan: { amount, borrower1, id },
        ...rest
      } = item;
      const row = {
        ...rest,
        lastPayment: DateHelpers.parse(lastPaymentDate).format('MM/YYYY'),
        loanId: id,
        borrower: `${borrower1.lastName} ${borrower1.firstName}`,
        loanAmount: amount,
      };
      return [...accum, row];
    }, []);
  }

  findOne(id: number) {
    return `This action returns a #${id} balance`;
  }

  async update(params: {
    where: Prisma.BalanceWhereUniqueInput;
    data: Balance;
  }) {
    try {
      const { data, where } = params;

      const newData: Prisma.BalanceCreateInput = {
        ...data,
        loan: { connect: { id: where.loanId } },
      };

      return this.prismaService.balance.update({
        data: newData,
        where,
      });
    } catch (error) {
      throw error;
    }
  }
}
