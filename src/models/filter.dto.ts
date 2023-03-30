import {
  IsOptional,
  IsPositive,
  IsString,
  Min,
  IsMongoId,
} from 'class-validator';

export class FilterDto {
  @IsOptional()
  @IsPositive()
  readonly pageSize: number;

  @IsOptional()
  @Min(0)
  readonly current: number;

  @IsOptional()
  @IsString()
  readonly name: string;

  @IsOptional()
  sort: string;
}

export class MongoIdDto {
  @IsMongoId({ message: '_id not valid!!' })
  readonly id: string;
}
