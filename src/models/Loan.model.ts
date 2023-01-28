import { IsString, IsDefined, IsOptional, IsDate } from "class-validator";
import { User, Borrower, Transaction, Term } from "./";

export class Loan {
    @IsDefined()
    @IsString()
    id!: string;

    @IsDefined()
    uinsert!: User;

    @IsDefined()
    borrower1!: Borrower;

    @IsOptional()
    borrower2?: Borrower;

    @IsDefined()
    amount!: number;

    @IsDefined()
    @IsDate()
    startDate!: Date;

    @IsDefined()
    @IsDate()
    createdAt!: Date;

    @IsDefined()
    @IsDate()
    updatedAt!: Date;

    @IsDefined()
    transactions!: Transaction[];

    @IsDefined()
    terms!: Term[];

    @IsDefined()
    @IsString()
    uinsertId!: string;

    @IsDefined()
    @IsString()
    borrower1Id!: string;

    @IsOptional()
    @IsString()
    borrower2Id?: string;
}
