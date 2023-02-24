import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Prisma } from '@prisma/client';
import {
  IsString,
  IsDefined,
  IsDate,
  IsOptional,
  IsNotEmptyObject,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { MongoIdDto } from './';
import { type } from 'os';

export class Transaction {
  @IsDefined()
  @IsDate()
  @ApiProperty()
  readonly date!: Date;

  @IsDefined()
  @ApiProperty()
  readonly amount!: number;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly description?: string;

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => MongoIdDto)
  @ApiProperty({ type: () => MongoIdDto })
  readonly concept!: MongoIdDto;

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => MongoIdDto)
  @ApiProperty({ type: () => MongoIdDto })
  readonly loan!: MongoIdDto;
}

const transactionWithConcept = Prisma.validator<Prisma.TransactionArgs>()({
  include: { concept: true },
});

export type TransactionWithConcept = Prisma.TransactionGetPayload<
  typeof transactionWithConcept
>;
