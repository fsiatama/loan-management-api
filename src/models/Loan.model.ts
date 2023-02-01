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
  IsArray,
  IsNotEmpty,
  ArrayMaxSize,
  ArrayMinSize,
} from 'class-validator';
import { Term, MongoIdDto } from './';

export class Loan {
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => MongoIdDto)
  @ApiProperty({ type: () => MongoIdDto })
  readonly borrower1!: MongoIdDto;

  @IsObject()
  @IsOptional()
  @ApiProperty({ type: () => MongoIdDto })
  readonly borrower2: Partial<MongoIdDto>;

  @IsDefined()
  @IsNumber()
  @IsPositive()
  @ApiProperty()
  readonly amount: number;

  @IsDefined()
  @IsDate()
  @ApiProperty()
  readonly startDate: Date;

  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(1)
  @Type(() => Term)
  @ApiProperty({ type: () => Term })
  readonly terms: Term[];
}
