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
import { User } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { FilterDto, MongoIdDto } from '../models';

@UseGuards(AuthGuard('jwt'))
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<Partial<User>> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(@Query() params: FilterDto) {
    return this.usersService.findAll(params);
  }

  @Get('profile')
  getProfile(@Request() req) {
    const { sub: id } = req.user;
    return this.usersService.findOne({ id });
  }

  @Get(':id')
  findOne(@Param() urlParams: MongoIdDto) {
    return this.usersService.findOne({ id: urlParams.id });
  }

  @Patch(':id')
  update(@Param() urlParams: MongoIdDto, @Body() updateUserDto: UpdateUserDto) {
    const params = {
      where: { id: urlParams.id },
      data: updateUserDto,
    };

    return this.usersService.update(params);
  }

  @Delete('batch')
  batchRemove(@Body() keys) {
    return this.usersService.batchRemove(keys);
  }
}
