import {
  Controller,
  Request,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { LoansService } from './loans.service';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { FilterDto, Loan, MongoIdDto } from '../models';

@UseGuards(AuthGuard('jwt'))
@ApiTags('loans')
@Controller('loans')
export class LoansController {
  constructor(private readonly loansService: LoansService) {}

  @Post()
  create(@Body() createLoanDto: Loan, @Request() req) {
    const { sub } = req.user;
    return this.loansService.create(createLoanDto, sub);
  }

  @Get()
  findAll(@Query() params: FilterDto) {
    return this.loansService.findAll(params);
  }

  @Get(':id')
  findOne(@Param() urlParams: MongoIdDto) {
    return this.loansService.findOne({ id: urlParams.id });
  }

  @Get('projection/:id')
  project(@Param() urlParams: MongoIdDto) {
    return this.loansService.projection({ id: urlParams.id });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLoanDto: UpdateLoanDto) {
    return this.loansService.update(+id, updateLoanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.loansService.remove(+id);
  }
}
