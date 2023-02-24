import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsDefined,
  IsDate,
  IsInt,
  IsNumber,
  IsPositive,
  IsObject,
} from 'class-validator';
import { MongoIdDto } from './';

export class Balance {
  @IsDefined()
  @IsNumber()
  @IsPositive()
  @ApiProperty()
  readonly amountPaid!: number;

  @IsDefined()
  @IsNumber()
  @IsPositive()
  @ApiProperty()
  readonly amountToPrincipal!: number;

  @IsDefined()
  @IsNumber()
  @IsPositive()
  @ApiProperty()
  readonly amountToInterest!: number;

  @IsDefined()
  @IsNumber()
  @IsPositive()
  @ApiProperty()
  readonly amountInArrears!: number;

  @IsDefined()
  @IsNumber()
  @IsPositive()
  @ApiProperty()
  readonly amountLateFee!: number;

  @IsDefined()
  @IsInt()
  @IsPositive()
  @ApiProperty()
  readonly latePayments!: number;

  @IsDefined()
  @IsDate()
  @ApiProperty()
  readonly lastPaymentDate?: Date;

  @IsDefined()
  @IsString()
  @ApiProperty()
  readonly installment!: string;

  @IsObject()
  @IsDefined()
  @ApiProperty({ type: () => MongoIdDto })
  readonly loan!: Partial<MongoIdDto>;
}
