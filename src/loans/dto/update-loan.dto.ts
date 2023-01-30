import { PartialType } from '@nestjs/swagger';
import { Loan } from '../../models';

export class UpdateLoanDto extends PartialType(Loan) {}
