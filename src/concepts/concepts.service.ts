import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FilterDto, Concept as ConceptDto } from '../models';
import { UpdateConceptDto } from './dto/update-concept.dto';
import { PrismaService } from '../database/prisma.service';
import { Concept, Prisma } from '@prisma/client';

@Injectable()
export class ConceptsService {
  constructor(private prismaService: PrismaService) {}

  private async validateReferences(
    data: ConceptDto | UpdateConceptDto,
    id: string,
  ) {
    if (data.name) {
      const existConceptName = await this.findDuplicateName({
        name: data.name,
        id,
      });
      if (existConceptName) {
        throw new HttpException(
          'Concept alredy registered',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    return data;
  }

  private async findDuplicateName(
    conceptWhereUniqueInput: Prisma.ConceptWhereUniqueInput,
  ): Promise<Concept> {
    return await this.prismaService.concept.findFirst({
      where: {
        name: conceptWhereUniqueInput.name,
        NOT: {
          id: conceptWhereUniqueInput.id,
        },
      },
    });
  }

  async create(params: ConceptDto): Promise<Concept> {
    try {
      //await this.validateReferences(params, ' ');

      // const { name } = params;
      const data: Prisma.ConceptCreateInput = params;

      return this.prismaService.concept.create({ data });
    } catch (error) {
      throw error;
    }
  }

  async findAllNames(params?: FilterDto) {
    const { pageSize = 20, current = 1, name } = params;

    const options: {
      skip?: number;
      take?: number;
      cursor?: Prisma.ConceptWhereUniqueInput;
      where?: Prisma.ConceptWhereInput;
      orderBy?: Prisma.ConceptOrderByWithRelationInput;
      select: Prisma.ConceptSelect;
    } = {
      take: pageSize,
      skip: (current - 1) * pageSize,
      orderBy: {
        name: 'asc',
      },
      select: {
        id: true,
        name: true,
        conceptType: true,
        isToThirdParty: true,
      },
    };

    if (name) {
      options.where = {
        OR: [
          {
            name: {
              contains: `${name}`,
            },
          },
        ],
      };
    }

    return this.prismaService.concept.findMany(options);
  }

  async findAll(params?: FilterDto) {
    const { pageSize = 20, current = 1, name } = params;

    const options: {
      skip?: number;
      take?: number;
      cursor?: Prisma.ConceptWhereUniqueInput;
      where?: Prisma.ConceptWhereInput;
      orderBy?: Prisma.ConceptOrderByWithRelationInput;
      select: Prisma.ConceptSelect;
    } = {
      take: pageSize,
      skip: (current - 1) * pageSize,
      orderBy: {
        name: 'asc',
      },
      select: {
        id: true,
        name: true,
        conceptType: true,
        isToThirdParty: true,
      },
    };

    if (name) {
      options.where = {
        OR: [
          {
            name: {
              contains: `${name}`,
            },
          },
        ],
      };
    }

    const conceptCount = await this.prismaService.concept.count();

    const result: Partial<Concept>[] =
      await this.prismaService.concept.findMany(options);

    return {
      data: result,
      current,
      pageSize,
      success: true,
      total: conceptCount,
    };
  }

  async findOne(where: Prisma.ConceptWhereUniqueInput) {
    const concept = await this.prismaService.concept.findUnique({
      where,
      include: {
        transactions: true,
      },
    });

    if (!concept) {
      throw new HttpException('Concept not found', HttpStatus.NOT_FOUND);
    }
    return concept;
  }

  async update(params: {
    where: Prisma.ConceptWhereUniqueInput;
    data: UpdateConceptDto;
  }): Promise<Concept> {
    try {
      const { data, where } = params;
      const concept = await this.findOne(where);

      if (concept.transactions.length > 0) {
        throw new HttpException(
          `The borrower : ${concept.name}, has associated information and cannot be updated.`,
          HttpStatus.PRECONDITION_FAILED,
        );
      }

      const newData = { ...data };

      await this.validateReferences(newData, where.id);

      return this.prismaService.concept.update({
        data: newData,
        where,
      });
    } catch (error) {
      throw error;
    }
  }

  private async remove(
    where: Prisma.ConceptWhereUniqueInput,
  ): Promise<Concept> {
    return this.prismaService.concept.delete({
      where,
    });
  }

  async batchRemove({ key }: { key: string[] }) {
    try {
      return await this.prismaService.$transaction(async () => {
        await key.reduce(async (antPromise, item) => {
          await antPromise;
          const concept = await this.findOne({ id: item });
          if (concept.transactions.length > 0) {
            throw new HttpException(
              `The borrower : ${concept.name}, has associated information and cannot be deleted.`,
              HttpStatus.PRECONDITION_FAILED,
            );
          }
          await this.remove({ id: item });
        }, Promise.resolve());
      });
    } catch (err) {
      console.log('Delete Concepts transaction failed');
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
}
