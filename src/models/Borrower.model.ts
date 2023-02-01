import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsString,
  IsNotEmptyObject,
  IsObject,
  ValidateNested,
  IsOptional,
  IsNotEmpty,
  IsEmail,
  IsNumberString,
  IsPhoneNumber,
} from 'class-validator';

class Address {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly street: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly city: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly state: string;

  @IsNumberString()
  @IsNotEmpty()
  @ApiProperty()
  readonly zip: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  @ApiProperty()
  readonly phone: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly phone2?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly phone3?: string;
}

export class Borrower {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  @ApiProperty({ description: 'the email of borrower' })
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly firstName: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.toUpperCase())
  @ApiProperty()
  readonly lastName: string;

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => Address)
  @ApiProperty()
  readonly address: Address;
}
