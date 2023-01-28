import { IsString, IsDefined, IsIn, IsDate } from "class-validator";
import { Transaction } from "./";
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
    @IsIn(getEnumValues(ConceptEnumType))
    conceptType!: ConceptEnumType;

    @IsDefined()
    @IsDate()
    createdAt!: Date;

    @IsDefined()
    transactions!: Transaction[];
}
