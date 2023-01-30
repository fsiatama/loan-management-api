import { IsString, IsDefined, IsIn, IsDate } from 'class-validator';
import { Transaction } from './';
import { getEnumValues } from './helpers';
import { ConceptEnumType } from './enums';

export class Concept {
  @IsDefined()
  @IsString()
  readonly id!: string;

  @IsDefined()
  @IsString()
  readonly name!: string;

  @IsDefined()
  @IsIn(getEnumValues(ConceptEnumType))
  readonly conceptType!: ConceptEnumType;
}
