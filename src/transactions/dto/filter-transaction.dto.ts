import { PartialType } from '@nestjs/swagger';
import { FilterDto } from '../../models';
import { IsMongoId } from 'class-validator';

export class FilterTransactionDto extends PartialType(FilterDto) {
  @IsMongoId({ message: '_id not valid!!' })
  readonly loanId: string;
}
