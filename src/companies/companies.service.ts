import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Like, Repository } from 'typeorm';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from './entities/company.entity';
import { FilterCompaniesDto } from './dto/filter-companies.dto';
import { RowCompanyDto } from './dto/row-company.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Company) private companyRepo: Repository<Company>,
  ) {}

  private async validateReferences(
    data: CreateCompanyDto | UpdateCompanyDto,
    currentCompany: Company,
  ) {
    const newCompany = currentCompany;

    if (data.userTemplate) {
      const userTemplate = await this.userRepo.findOneBy({
        id: data.userTemplate.id,
      });
      if (!userTemplate) {
        throw new HttpException(
          'User Template not exist',
          HttpStatus.NOT_FOUND,
        );
      }
      newCompany.userTemplate = userTemplate;
    }

    return newCompany;
  }

  async create(data: CreateCompanyDto) {
    const company = this.companyRepo.create(data);
    const newCompany = await this.validateReferences(data, company);
    return this.companyRepo.save(newCompany);
  }

  async findAll(params: FilterCompaniesDto): Promise<API.Response<Company>> {
    const { pageSize = 20, current = 1, name } = params;

    const options: FindManyOptions<Company> = {
      take: pageSize,
      skip: (current - 1) * pageSize,
    };

    if (name) {
      options.where = [{ name: Like(`%${name}%`) }, { nit: Like(`%${name}%`) }];
    }

    const [data, total] = await this.companyRepo.findAndCount({
      relations: ['userTemplate', 'users'],
      ...options,
    });

    const companies = data.reduce((accum: RowCompanyDto[], company) => {
      const { users } = company;
      const item: RowCompanyDto = {
        ...company,
        totalUsersCount: users ? users.length : 0,
        users: [],
      };
      return [...accum, item];
    }, []);

    return {
      data: companies,
      current,
      pageSize,
      success: true,
      total,
    };
  }

  findOne(id: number) {
    return this.companyRepo.findOne({
      where: {
        id,
      },
      relations: ['userTemplate'],
    });
  }

  update(id: number, updateCompanyDto: UpdateCompanyDto) {
    return `This action updates a #${id} company`;
  }

  remove(id: number) {
    return `This action removes a #${id} company`;
  }
}
