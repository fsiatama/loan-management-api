import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSuscriptionDto } from './dto/create-suscription.dto';
import { UpdateSuscriptionDto } from './dto/update-suscription.dto';
import { Suscription } from './entities/suscription.entity';

@Injectable()
export class SuscriptionsService {
  constructor(
    @InjectRepository(Suscription)
    private suscriptionRepo: Repository<Suscription>,
  ) {}

  create(createSuscriptionDto: CreateSuscriptionDto) {
    return 'This action adds a new suscription';
  }

  findAll() {
    return this.suscriptionRepo.find({
      relations: ['user'],
    });
  }

  findByUser(id: number) {
    return this.suscriptionRepo.find({
      relations: ['user'],
      where: {
        user: {
          id,
        },
      },
      select: {
        initialDate: true,
        user: { username: true },
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} suscription`;
  }

  update(id: number, updateSuscriptionDto: UpdateSuscriptionDto) {
    return `This action updates a #${id} suscription`;
  }

  remove(id: number) {
    return `This action removes a #${id} suscription`;
  }
}
