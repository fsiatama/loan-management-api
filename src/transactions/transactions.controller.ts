import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Request,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { FilterDto, Transaction, MongoIdDto } from '../models';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { FilterTransactionDto } from './dto/filter-transaction.dto';

@UseGuards(AuthGuard('jwt'))
@ApiTags('loans')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(@Body() createTransactionDto: Transaction, @Request() req) {
    const { sub } = req.user;
    return this.transactionsService.create(createTransactionDto, sub);
  }

  @Get()
  findAll(@Query() params: FilterTransactionDto) {
    return this.transactionsService.findAll(params);
  }

  @Get(':id')
  findOne(@Param() urlParams: MongoIdDto) {
    return this.transactionsService.findOne({ id: urlParams.id });
  }

  @Patch(':id')
  update(
    @Param() urlParams: MongoIdDto,
    @Body() updateTransactionDto: UpdateTransactionDto,
    @Request() req,
  ) {
    const { sub } = req.user;
    const params = {
      where: { id: urlParams.id },
      data: updateTransactionDto,
      userId: sub,
    };
    return this.transactionsService.update(params);
  }
}
