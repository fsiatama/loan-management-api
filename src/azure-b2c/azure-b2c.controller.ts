import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AzureB2cService } from './azure-b2c.service';
import { CreateAzureB2cDto } from './dto/create-azure-b2c.dto';
import { UpdateAzureB2cDto } from './dto/update-azure-b2c.dto';

@Controller('azure-b2c')
export class AzureB2cController {
  constructor(private readonly azureB2cService: AzureB2cService) {}

  @Post()
  create(@Body() createAzureB2cDto: CreateAzureB2cDto) {
    return this.azureB2cService.create(createAzureB2cDto);
  }

  @Get()
  findAll() {
    return this.azureB2cService.findAll();
  }

  @Get('attributes')
  atributtes() {
    return this.azureB2cService.listAttributes();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.azureB2cService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAzureB2cDto: UpdateAzureB2cDto,
  ) {
    return this.azureB2cService.update(+id, updateAzureB2cDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.azureB2cService.remove(+id);
  }
}
