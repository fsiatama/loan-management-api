import { Controller, Get, Body, Patch, Param, Delete } from '@nestjs/common';
import { AzureB2cService } from './azure-b2c.service';
import { UpdateAzureB2cDto } from './dto/update-azure-b2c.dto';

import * as MOCKED_RESPONSE from './data/sicex-app.json';

@Controller('azure-b2c')
export class AzureB2cController {
  constructor(private readonly azureB2cService: AzureB2cService) {}

  @Get()
  findAll() {
    return this.azureB2cService.findAll();
  }

  @Get('attributes')
  atributtes() {
    return this.azureB2cService.listAttributes();
  }

  @Get('bulk')
  bulkCreate() {
    return this.azureB2cService.bulkCreate(MOCKED_RESPONSE);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.azureB2cService.getUser(id);
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
