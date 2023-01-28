import { IsString, IsDefined, IsDate } from 'class-validator';
import { User, Loan } from './';

export class Borrower {
  @IsDefined()
  @IsString()
  id!: string;

  @IsDefined()
  @IsString()
  email!: string;

  @IsDefined()
  @IsString()
  firstName!: string;

  @IsDefined()
  @IsString()
  lastName!: string;

  @IsDefined()
  address!: API.Address;

  @IsDefined()
  uinsert!: User;

  @IsDefined()
  @IsString()
  uinsertId!: string;

  @IsDefined()
  @IsDate()
  createdAt!: Date;

  @IsDefined()
  @IsDate()
  updatedAt!: Date;

  @IsDefined()
  Loan_Loan_borrowerPrincipal!: Loan[];

  @IsDefined()
  Loan_Loan_coBorrower!: Loan[];
}
