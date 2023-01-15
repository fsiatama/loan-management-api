import { IsOptional, IsPositive, IsString, Min } from 'class-validator';

export class FilterSubscriptionsDto {
  @IsOptional()
  @IsPositive()
  pageSize: number;

  @IsOptional()
  @Min(0)
  current: number;

  @IsOptional()
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  initialDate: string;

  @IsOptional()
  @IsString()
  finalDate: string;
}
