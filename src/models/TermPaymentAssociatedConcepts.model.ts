import {
  IsDefined,
  IsNumber,
  IsPositive,
  IsNotEmptyObject,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { MongoIdDto } from './';

export class TermPaymentAssociatedConcepts {
  @IsDefined()
  @IsNumber()
  @IsPositive()
  @ApiProperty()
  readonly amount!: number;

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => MongoIdDto)
  @ApiProperty({ type: () => MongoIdDto })
  readonly concept!: MongoIdDto;
}
