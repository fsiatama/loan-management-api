import { IsString, IsDefined, IsDate, IsOptional } from "class-validator";
import { Loan, User, Concept } from "./";

export class Transaction {
    @IsDefined()
    @IsString()
    id!: string;

    @IsDefined()
    @IsDate()
    date!: Date;

    @IsDefined()
    amount!: number;

    @IsOptional()
    @IsString()
    description?: string;

    @IsDefined()
    loan!: Loan;

    @IsDefined()
    @IsString()
    loanId!: string;

    @IsDefined()
    uinsert!: User;

    @IsDefined()
    @IsString()
    uinsertId!: string;

    @IsDefined()
    @IsDate()
    createdAt!: Date;

    @IsDefined()
    concept!: Concept;

    @IsDefined()
    @IsString()
    conceptId!: string;
}
