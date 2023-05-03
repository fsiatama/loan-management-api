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
  StreamableFile,
  Header,
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

  @Get('statistics')
  getStatistics() {
    return this.loansService.getStatistics();
  }

  @Get(':id')
  findOne(@Param() urlParams: MongoIdDto) {
    return this.loansService.findOne({ id: urlParams.id });
  }

  @Get('statement/:id')
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename="statement.pdf"')
  async getStatementFile(
    @Param() urlParams: MongoIdDto,
    @Query('date') date: string,
  ) {
    const file = await this.loansService.generateStatement(
      {
        id: urlParams.id,
      },
      date,
    );

    if (file) {
      return new StreamableFile(file);
    }

    return { success: false };
  }

  @Get('projection/:id')
  project(@Param() urlParams: MongoIdDto) {
    return this.loansService.projection({ id: urlParams.id });
  }

  @Patch(':id')
  update(
    @Param() urlParams: MongoIdDto,
    @Body() updateLoanDto: Loan,
    @Request() req,
  ) {
    const { sub } = req.user;
    const params = {
      where: { id: urlParams.id },
      data: updateLoanDto,
      userId: sub,
    };
    return this.loansService.update(params);
  }

  @Delete('batch')
  batchRemove(@Body() keys) {
    return this.loansService.batchRemove(keys);
  }
}
