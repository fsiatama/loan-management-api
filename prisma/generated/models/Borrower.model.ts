import { Type } from 'class-transformer';
import {
  IsString,
  IsDefined,
  IsNotEmptyObject,
  IsObject,
  ValidateNested,
  IsOptional,
  IsNotEmpty,
  IsEmail,
  isNumberString,
  IsNumberString,
  IsPhoneNumber,
} from 'class-validator';

class Address {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  street!: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  city!: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  state!: string;

  @IsDefined()
  @IsNumberString()
  @IsNotEmpty()
  zip!: string;

  @IsDefined()
  @IsPhoneNumber()
  @IsNotEmpty()
  phone!: string;

  @IsOptional()
  @IsString()
  phone2?: string;

  @IsOptional()
  @IsString()
  phone3?: string;
}

export class Borrower {
  @IsDefined()
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => Address)
  address!: Address;
}
