import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateBorrowerDto } from './dto/update-borrower.dto';
import { PrismaService } from '../database/prisma.service';
import { Borrower, Prisma } from '@prisma/client';
import { FilterDto, Borrower as BorrowerDto } from '../models';

@Injectable()
export class BorrowersService {
  constructor(private prismaService: PrismaService) {}

  private async validateReferences(
    data: BorrowerDto | UpdateBorrowerDto,
    id: string,
  ) {
    if (data.email) {
      const existBorrowername = await this.findDuplicateEmail({
        email: data.email,
        id,
      });
      if (existBorrowername) {
        throw new HttpException(
          'Borrower email alredy registered',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    return data;
  }

  private async findDuplicateEmail(
    borrowerWhereUniqueInput: Prisma.BorrowerWhereUniqueInput,
  ): Promise<Borrower> {
    return await this.prismaService.borrower.findFirst({
      where: {
        email: borrowerWhereUniqueInput.email,
        NOT: {
          id: borrowerWhereUniqueInput.id,
        },
      },
    });
  }

  async create(params: BorrowerDto, userId: string): Promise<Borrower> {
    try {
      await this.validateReferences(params, '000000000000000000000000');

      const { email, firstName, lastName, address } = params;
      const data: Prisma.BorrowerCreateInput = {
        email,
        firstName,
        lastName,
        uinsert: { connect: { id: userId } },
        address,
      };

      return this.prismaService.borrower.create({
        data,
      });
    } catch (error) {
      throw error;
    }
  }

  async findAll(params?: FilterDto) {
    const { pageSize = 20, current = 1, name } = params;

    const options: {
      skip?: number;
      take?: number;
      cursor?: Prisma.BorrowerWhereUniqueInput;
      where?: Prisma.BorrowerWhereInput;
      orderBy?: Prisma.BorrowerOrderByWithRelationInput;
      select: Prisma.BorrowerSelect;
    } = {
      take: pageSize,
      skip: (current - 1) * pageSize,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        address: true,
        uinsert: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    };

    if (name) {
      options.where = {
        OR: [
          {
            firstName: {
              contains: `${name}`,
            },
          },
          {
            lastName: {
              contains: `${name}`,
            },
          },
          {
            email: {
              contains: `${name}`,
            },
          },
        ],
      };
    }

    const borrowerCount = await this.prismaService.borrower.count();

    const result: Partial<Borrower>[] =
      await this.prismaService.borrower.findMany(options);

    return {
      data: result,
      current,
      pageSize,
      success: true,
      total: borrowerCount,
    };
  }

  async findOne(
    where: Prisma.BorrowerWhereUniqueInput,
  ): Promise<Borrower | null> {
    const borrower = await this.prismaService.borrower.findUnique({ where });

    if (!borrower) {
      throw new HttpException('Borrower not found', HttpStatus.NOT_FOUND);
    }
    return borrower;
  }

  async update(params: {
    where: Prisma.BorrowerWhereUniqueInput;
    data: UpdateBorrowerDto;
  }): Promise<Borrower> {
    try {
      const { data, where } = params;
      await this.findOne(where);

      const newData = { ...data };

      await this.validateReferences(newData, where.id);

      return this.prismaService.borrower.update({
        data: newData,
        where,
      });
    } catch (error) {
      throw error;
    }
  }

  private async remove(
    where: Prisma.BorrowerWhereUniqueInput,
  ): Promise<Borrower> {
    return this.prismaService.borrower.delete({
      where,
    });
  }

  async batchRemove({ key }: { key: string[] }) {
    try {
      return await this.prismaService.$transaction(async () => {
        await key.reduce(async (antPromise, item) => {
          await antPromise;
          const user = await this.findOne({ id: item });
          await this.remove({ id: item });
        }, Promise.resolve());
      });
    } catch (err) {
      console.log('Delete Borrowers transaction failed');
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
}
