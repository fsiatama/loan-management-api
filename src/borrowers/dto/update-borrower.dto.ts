import { PartialType } from '@nestjs/swagger';
import { Borrower } from '../../models';

export class UpdateBorrowerDto extends PartialType(Borrower) {}
