import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsPositive,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ description: 'the email of user' })
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'the username of user' })
  readonly username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: `User name` })
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: `User lastname` })
  readonly lastName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly city: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly phone: string;

  @IsPositive()
  @IsNotEmpty()
  @ApiProperty()
  readonly langId: number;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  readonly isRoot: boolean;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  readonly isActive: boolean;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  readonly canRenovate: boolean;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  readonly canDownload: boolean;

  @IsPositive()
  @IsOptional()
  @ApiProperty()
  readonly countryId: number;

  @IsPositive()
  @IsNotEmpty()
  @ApiProperty()
  readonly companyId: number;
}
