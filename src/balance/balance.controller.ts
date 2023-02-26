import { Controller, Get, Param } from '@nestjs/common';
import { BalanceService } from './balance.service';

@Controller('balance')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Get()
  findAll() {
    return this.balanceService.getStatistics();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.balanceService.findOne(+id);
  }
}
