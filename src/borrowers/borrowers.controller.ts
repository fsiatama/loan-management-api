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
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { BorrowersService } from './borrowers.service';
import { UpdateBorrowerDto } from './dto/update-borrower.dto';
import { FilterDto, Borrower, MongoIdDto } from '../models';

@UseGuards(AuthGuard('jwt'))
@ApiTags('users')
@Controller('borrowers')
export class BorrowersController {
  constructor(private readonly borrowersService: BorrowersService) {}

  @Post()
  create(@Body() createBorrowerDto: Borrower, @Request() req) {
    const { sub } = req.user;
    return this.borrowersService.create(createBorrowerDto, sub);
  }

  @Get()
  findAll(@Query() params: FilterDto) {
    return this.borrowersService.findAll(params);
  }

  @Get('names')
  findAllNames(@Query() params: FilterDto) {
    return this.borrowersService.findAllNames(params);
  }

  @Get(':id')
  findOne(@Param() urlParams: MongoIdDto) {
    return this.borrowersService.findOne({ id: urlParams.id });
  }

  @Patch(':id')
  update(
    @Param() urlParams: MongoIdDto,
    @Body() updateBorrowerDto: UpdateBorrowerDto,
  ) {
    const params = {
      where: { id: urlParams.id },
      data: updateBorrowerDto,
    };
    return this.borrowersService.update(params);
  }

  @Delete('batch')
  batchRemove(@Body() keys) {
    return this.borrowersService.batchRemove(keys);
  }
}
