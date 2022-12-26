import { PartialType } from '@nestjs/swagger';
import { CreateAzureB2cDto } from './create-azure-b2c.dto';

export class UpdateAzureB2cDto extends PartialType(CreateAzureB2cDto) {}
