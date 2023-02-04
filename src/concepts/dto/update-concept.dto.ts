import { PartialType } from '@nestjs/swagger';
import { Concept } from '../../models';

export class UpdateConceptDto extends PartialType(Concept) {}
