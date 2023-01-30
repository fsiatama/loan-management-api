import {
  IsDefined,
  IsInt,
  IsDate,
  Min,
  Max,
  IsPositive,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class Term {
  @IsDefined()
  @IsPositive()
  @ApiProperty()
  readonly months: number;

  @IsDefined()
  @IsPositive()
  @ApiProperty()
  readonly annualInterestRate: number;

  @IsDefined()
  @IsNumber()
  readonly latePaymentFee: number;

  @IsOptional()
  @IsDate()
  readonly beginToApplyDate?: Date;

  @IsDefined()
  @IsInt()
  @Min(1)
  @Max(31)
  @Type(() => Number)
  readonly cutOffDay: number;
}
