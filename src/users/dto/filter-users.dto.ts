import { IsOptional, IsPositive, IsString, Min } from 'class-validator';

export class FilterUsersDto {
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
