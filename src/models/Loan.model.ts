import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDefined,
  IsOptional,
  IsDate,
  IsNotEmptyObject,
  IsObject,
  ValidateNested,
  IsPositive,
  IsNumber,
} from 'class-validator';
import { Term, MongoIdDto } from './';

export class Loan {
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => MongoIdDto)
  @ApiProperty({ type: () => MongoIdDto })
  readonly borrower1: MongoIdDto;

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => MongoIdDto)
  @ApiProperty({ type: () => MongoIdDto })
  readonly borrower2?: MongoIdDto;

  @IsDefined()
  @IsNumber()
  @IsPositive()
  readonly amount: number;

  @IsDefined()
  @IsDate()
  readonly startDate: Date;

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => Term)
  @ApiProperty({ type: () => Term })
  readonly terms: Term;
}
