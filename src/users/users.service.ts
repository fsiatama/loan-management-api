import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { AzureB2cService } from '../azure-b2c/azure-b2c.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Country } from '../countries/entities/country.entity';
import { Company } from '../companies/entities/company.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Country) private countryRepo: Repository<Country>,
    @InjectRepository(Company) private companyRepo: Repository<Company>,
    @Inject(forwardRef((): typeof AzureB2cService => AzureB2cService))
    private azureB2cService: AzureB2cService,
    private dataSource: DataSource,
  ) {}

  async create(data: CreateUserDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newUser = this.userRepo.create(data);
      if (data.companyId) {
        const company = await this.companyRepo.findOne({
          where: { id: data.companyId },
        });
        if (!company) {
          throw new BadRequestException('Company not exist');
        }
        newUser.company = company;
      }

      if (data.countryId) {
        const country = await this.countryRepo.findOne({
          where: { id: data.countryId },
        });
        if (!country) {
          throw new BadRequestException('Country not exist');
        }
        newUser.country = country;
      }
      const userCreated = await queryRunner.manager.save(newUser);
      const userAD = await this.azureB2cService.create(userCreated);

      await queryRunner.commitTransaction();
      return userAD;
    } catch (err) {
      console.log('transaction failed');
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(err);
    } finally {
      await queryRunner.release();
    }
  }

  findAll() {
    return this.userRepo.find({
      relations: ['country', 'company'],
    });
  }

  async findOne(id: number) {
    return this.userRepo.findOne({
      where: { id },
      relations: ['country', 'company'],
    });
  }

  async findByEmail(email: string) {
    return this.userRepo.findOneBy({ email });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
