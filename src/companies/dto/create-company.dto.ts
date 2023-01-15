import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';
import { User } from 'src/users/entities/user.entity';

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.toUpperCase())
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
