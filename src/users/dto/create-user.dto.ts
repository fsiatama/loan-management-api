import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsBoolean,
  IsOptional,
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
  readonly firstName: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.toUpperCase())
  @ApiProperty({ description: `User lastname` })
  readonly lastName: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly phone: string;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  readonly isRoot: boolean;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  readonly isActive: boolean;
}
