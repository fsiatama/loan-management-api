import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { User } from 'src/users/entities/user.entity';

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: `Company name` })
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: `Company ID` })
  readonly nit: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: `Company Digit check` })
  readonly digcheq: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: `Allowed IP's` })
  readonly allowedIps: string;

  @IsObject()
  @IsOptional()
  @ApiProperty({ description: `User Template` })
  readonly userTemplate: Partial<User>;
}
