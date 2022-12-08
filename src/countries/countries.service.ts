import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { Country } from './entities/country.entity';

@Injectable()
export class CountriesService {
  constructor(
    @InjectRepository(Country) private countryRepo: Repository<Country>,
  ) {}

  create(createCountryDto: CreateCountryDto) {
    return this.countryRepo.find();
  }

  findAll() {
    return this.countryRepo.find();
  }

  findOne(id: number) {
    return this.countryRepo.findOneBy({ id });
  }

  update(id: number, updateCountryDto: UpdateCountryDto) {
    return `This action updates a #${id} country`;
  }

  remove(id: number) {
    return `This action removes a #${id} country`;
  }
}
