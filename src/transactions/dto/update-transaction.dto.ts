import { PartialType } from '@nestjs/swagger';
import { Transaction } from '../../models';

export class UpdateTransactionDto extends PartialType(Transaction) {}
