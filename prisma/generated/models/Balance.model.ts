import { IsString, IsDefined, IsDate, IsInt } from "class-validator";
import { Loan } from "./";

export class Balance {
    @IsDefined()
    @IsString()
    id!: string;

    @IsDefined()
    @IsDate()
    date!: Date;

    @IsDefined()
    amountPaid!: number;

    @IsDefined()
    amountInArrears!: number;

    @IsDefined()
    amountThirdParty!: number;

    @IsDefined()
    amountLateFee!: number;

    @IsDefined()
    @IsInt()
    daysPastDue!: number;

    @IsDefined()
    loan!: Loan;

    @IsDefined()
    @IsString()
    loanId!: string;
}
