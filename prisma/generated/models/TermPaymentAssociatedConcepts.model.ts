import { IsString, IsDefined } from "class-validator";
import { Concept, Term } from "./";

export class TermPaymentAssociatedConcepts {
    @IsDefined()
    @IsString()
    id!: string;

    @IsDefined()
    amount!: number;

    @IsDefined()
    concept!: Concept;

    @IsDefined()
    @IsString()
    conceptId!: string;

    @IsDefined()
    term!: Term;

    @IsDefined()
    @IsString()
    termId!: string;
}
