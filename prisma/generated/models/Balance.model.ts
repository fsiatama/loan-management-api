import { IsString, IsDefined, IsInt, IsDate, IsOptional } from "class-validator";
import { Loan } from "./";

export class Balance {
    @IsDefined()
    @IsString()
    id!: string;

    @IsDefined()
    amountPaid!: number;

    @IsDefined()
    amountToPrincipal!: number;

    @IsDefined()
    amountToInterest!: number;

    @IsDefined()
    amountInArrears!: number;

    @IsDefined()
    amountLateFee!: number;

    @IsDefined()
    @IsInt()
    latePayments!: number;

    @IsOptional()
    @IsDate()
    lastPaymentDate?: Date;

    @IsDefined()
    @IsString()
    installment!: string;

    @IsDefined()
    @IsDate()
    updatedAt!: Date;

    @IsDefined()
    loan!: Loan;

    @IsDefined()
    @IsString()
    loanId!: string;
}
