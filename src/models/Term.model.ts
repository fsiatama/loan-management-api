import {
  IsDefined,
  IsInt,
  IsDate,
  Min,
  Max,
  IsPositive,
  IsNumber,
  IsOptional,
  IsArray,
  ArrayMaxSize,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { TermPaymentAssociatedConcepts } from './TermPaymentAssociatedConcepts.model';

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

  @IsDefined()
  @IsInt()
  @Min(1)
  @Max(31)
  @Type(() => Number)
  readonly paymentDay: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  readonly monthlyAmount: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  readonly monthlyRate: number;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @ArrayMaxSize(3)
  @Type(() => TermPaymentAssociatedConcepts)
  @ApiProperty({ type: () => TermPaymentAssociatedConcepts })
  readonly paymentAscConcepts?: TermPaymentAssociatedConcepts[];
}
