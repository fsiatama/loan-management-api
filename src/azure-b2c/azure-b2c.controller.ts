import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { AzureB2cService } from './azure-b2c.service';
// import { UpdateAzureB2cDto } from './dto/update-azure-b2c.dto';

// import * as MOCKED_RESPONSE from './data/sicex-app.json';

@UseGuards(AuthGuard('azure-ad'))
@ApiTags('azure-b2c')
@Controller('azure-b2c')
export class AzureB2cController {
  constructor(private readonly azureB2cService: AzureB2cService) {}

  @Get()
  getProfile(@Request() req) {
    return req.user;
  }

  /*
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
  */
}
