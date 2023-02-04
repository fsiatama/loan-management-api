import { IsString, IsDefined, IsIn, IsBoolean } from 'class-validator';
import { getEnumValues } from './helpers';
import { ConceptEnumType } from './enums';
import { ApiProperty } from '@nestjs/swagger';

export class Concept {
  @IsDefined()
  @IsString()
  @ApiProperty()
  readonly name!: string;

  @IsDefined()
  @IsBoolean()
  @ApiProperty()
  readonly isToThirdParty!: boolean;

  @IsDefined()
  @IsIn(getEnumValues(ConceptEnumType))
  @ApiProperty()
  readonly conceptType!: ConceptEnumType;
}
