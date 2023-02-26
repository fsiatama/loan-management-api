import { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { Balance } from '../models';
import { PrismaService } from '../database/prisma.service';

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

    return {
      ..._sum,
      activeBorrowers: _count.id,
      loansAmount: loansSum.amount,
    };
  }

  findAll() {
    return `This action returns all balance`;
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
