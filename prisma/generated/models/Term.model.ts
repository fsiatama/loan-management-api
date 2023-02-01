import { IsString, IsDefined, IsInt, IsDate } from "class-validator";
import { User, Loan } from "./";

export class Term {
    @IsDefined()
    @IsString()
    id!: string;

    @IsDefined()
    @IsInt()
    months!: number;

    @IsDefined()
    monthlyRate!: number;

    @IsDefined()
    annualInterestRate!: number;

    @IsDefined()
    monthlyAmount!: number;

    @IsDefined()
    latePaymentFee!: number;

    @IsDefined()
    @IsDate()
    beginToApplyDate!: Date;

    @IsDefined()
    @IsInt()
    cutOffDay!: number;

    @IsDefined()
    @IsInt()
    paymentDay!: number;

    @IsDefined()
    uinsert!: User;

    @IsDefined()
    @IsString()
    uinsertId!: string;

    @IsDefined()
    @IsDate()
    createdAt!: Date;

    @IsDefined()
    loan!: Loan;

    @IsDefined()
    @IsString()
    loanId!: string;
}
