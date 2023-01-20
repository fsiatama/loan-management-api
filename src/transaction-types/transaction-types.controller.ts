import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TransactionTypesService } from './transaction-types.service';
import { CreateTransactionTypeDto } from './dto/create-transaction-type.dto';
import { UpdateTransactionTypeDto } from './dto/update-transaction-type.dto';

@Controller('transaction-types')
export class TransactionTypesController {
  constructor(private readonly transactionTypesService: TransactionTypesService) {}

  @Post()
  create(@Body() createTransactionTypeDto: CreateTransactionTypeDto) {
    return this.transactionTypesService.create(createTransactionTypeDto);
  }

  @Get()
  findAll() {
    return this.transactionTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionTypesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTransactionTypeDto: UpdateTransactionTypeDto) {
    return this.transactionTypesService.update(+id, updateTransactionTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionTypesService.remove(+id);
  }
}
