import { IsOptional, IsPositive, IsString, Min } from 'class-validator';

export class FilterCompaniesDto {
  @IsOptional()
  @IsPositive()
  pageSize: number;

  @IsOptional()
  @Min(0)
  current: number;

  @IsOptional()
  @IsString()
  name: string;
}
