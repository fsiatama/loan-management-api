import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindManyOptions, Like, Not, Repository } from 'typeorm';
import { AzureB2cService } from '../azure-b2c/azure-b2c.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Country } from '../countries/entities/country.entity';
import { Company } from '../companies/entities/company.entity';
import { FilterUsersDto } from './dto/filter-users.dto';

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

  private async validateReferences(
    data: CreateUserDto | UpdateUserDto,
    currentUser: User,
  ) {
    const newUser = currentUser;

    if (data.username) {
      const id: number = currentUser.id ?? -1;
      const existUsername = await this.findByUsername(id, data.username);
      if (existUsername) {
        throw new HttpException(
          'Username alredy registered',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    if (data.companyId) {
      const company = await this.companyRepo.findOneBy({
        id: data.companyId,
      });
      if (!company) {
        throw new HttpException('Company not exist', HttpStatus.NOT_FOUND);
      }
      newUser.company = company;
    }

    if (data.countryId) {
      const country = await this.countryRepo.findOneBy({
        id: data.countryId,
      });
      if (!country) {
        throw new HttpException('Country not exist', HttpStatus.NOT_FOUND);
      }
      newUser.country = country;
    }
    return newUser;
  }

  async create(data: CreateUserDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = this.userRepo.create(data);
      const newUser = await this.validateReferences(data, user);
      const userCreated = await queryRunner.manager.save(newUser);
      const userAD = await this.azureB2cService.create(userCreated);
      await queryRunner.commitTransaction();
      return userAD;
    } catch (err) {
      console.log('Create User transaction failed');
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findAllTemplates(params?: FilterUsersDto) {
    return await this.userRepo.find({
      where: {
        isTemplate: true,
      },
      select: ['name', 'lastName', 'id'],
    });
  }
  async findAll(params?: FilterUsersDto): Promise<API.Response<User>> {
    const { pageSize = 20, current = 1, name } = params;

    const options: FindManyOptions<User> = {
      take: pageSize,
      skip: (current - 1) * pageSize,
    };

    if (name) {
      let [firstName, lastName] = name.split(' ');
      if (!lastName || !firstName) {
        lastName = name;
        firstName = name;
      }
      options.where = [
        { name: Like(`%${firstName}%`) },
        { lastName: Like(`%${lastName}%`) },
        { email: Like(`%${name}%`) },
        { username: Like(`%${name}%`) },
        {
          company: {
            name: Like(`%${name}%`),
          },
        },
      ];
    }
    const [data, total] = await this.userRepo.findAndCount({
      relations: ['country', 'company'],
      ...options,
    });

    return {
      data,
      current,
      pageSize,
      success: true,
      total,
    };
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['country', 'company'],
    });

    if (!user) {
      throw new HttpException('User not exist', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  private async findByUsername(id: number, username: string): Promise<User> {
    return await this.userRepo.findOneBy({
      username,
      id: Not(id),
    });
  }

  async findByEmailOrUsername(email: string) {
    return this.userRepo.findOneBy([{ email: email }, { username: email }]);
  }

  async update(id: number, changes: UpdateUserDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await this.findOne(id);
      this.userRepo.merge(user, changes);
      const newUser = await this.validateReferences(changes, user);
      const userUpdated = await queryRunner.manager.save(newUser);
      await this.azureB2cService.update(userUpdated);
      await queryRunner.commitTransaction();
      return userUpdated;
    } catch (err) {
      console.log('Update User transaction failed');
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
