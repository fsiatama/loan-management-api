import { IsString, IsDefined } from "class-validator";
import { Borrower, Loan, Transaction, Term } from "./";

export class User {
    @IsDefined()
    @IsString()
    id!: string;

    @IsDefined()
    @IsString()
    email!: string;

    @IsDefined()
    @IsString()
    password!: string;

    @IsDefined()
    @IsString()
    name!: string;

    @IsDefined()
    borrowers!: Borrower[];

    @IsDefined()
    Loan!: Loan[];

    @IsDefined()
    Transaction!: Transaction[];

    @IsDefined()
    Term!: Term[];
}
