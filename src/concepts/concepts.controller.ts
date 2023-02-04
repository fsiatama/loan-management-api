import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ConceptsService } from './concepts.service';
import { UpdateConceptDto } from './dto/update-concept.dto';
import { AuthGuard } from '@nestjs/passport';
import { Concept, FilterDto, MongoIdDto } from '../models';

@UseGuards(AuthGuard('jwt'))
@Controller('concepts')
export class ConceptsController {
  constructor(private readonly conceptsService: ConceptsService) {}

  @Post()
  create(@Body() createConceptDto: Concept) {
    return this.conceptsService.create(createConceptDto);
  }

  @Get()
  findAll(@Query() params: FilterDto) {
    return this.conceptsService.findAll(params);
  }

  @Get('names')
  findAllNames(@Query() params: FilterDto) {
    return this.conceptsService.findAllNames(params);
  }

  @Get(':id')
  findOne(@Param() urlParams: MongoIdDto) {
    return this.conceptsService.findOne({ id: urlParams.id });
  }

  @Patch(':id')
  update(
    @Param() urlParams: MongoIdDto,
    @Body() updateConceptDto: UpdateConceptDto,
  ) {
    const params = {
      where: { id: urlParams.id },
      data: updateConceptDto,
    };
    return this.conceptsService.update(params);
  }

  @Delete('batch')
  batchRemove(@Body() keys) {
    return this.conceptsService.batchRemove(keys);
  }
}
