import { IsString, IsDefined, IsBoolean, IsIn, IsDate } from "class-validator";
import { Transaction, TermPaymentAssociatedConcepts } from "./";
import { getEnumValues } from "../helpers";
import { ConceptEnumType } from "../enums";

export class Concept {
    @IsDefined()
    @IsString()
    id!: string;

    @IsDefined()
    @IsString()
    name!: string;

    @IsDefined()
    @IsBoolean()
    isToThirdParty!: boolean;

    @IsDefined()
    @IsIn(getEnumValues(ConceptEnumType))
    conceptType!: ConceptEnumType;

    @IsDefined()
    @IsDate()
    createdAt!: Date;

    @IsDefined()
    transactions!: Transaction[];

    @IsDefined()
    paymentAscConcepts!: TermPaymentAssociatedConcepts[];
}
