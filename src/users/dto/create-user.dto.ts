import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsPositive,
  IsBoolean,
  IsOptional,
  IsObject,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

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
  @Transform(({ value }) => value.toUpperCase())
  @ApiProperty({ description: `User name` })
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.toUpperCase())
  @ApiProperty({ description: `User lastname` })
  readonly lastName: string;

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
  readonly isTemplate: boolean;

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

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  readonly useMfa: boolean;
}
