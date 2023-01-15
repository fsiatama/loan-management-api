import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindManyOptions, Like, Repository } from 'typeorm';
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
    private dataSource: DataSource,
  ) {}

  private async validateReferences(
    data: CreateCompanyDto | UpdateCompanyDto,
    currentCompany: Company,
  ) {
    const newCompany = currentCompany;

    if (data.userTemplate) {
      if (!data.userTemplate.id) {
        // newCompany.userTemplateId = null;
        newCompany.userTemplate = null;
      } else {
        const userTemplate = await this.userRepo.findOneBy({
          id: data.userTemplate.id,
        });
        console.log(data.userTemplate, userTemplate);
        if (!userTemplate) {
          throw new HttpException(
            'User Template not exist',
            HttpStatus.NOT_FOUND,
          );
        }
        newCompany.userTemplate = userTemplate;
      }
    }

    return newCompany;
  }

  async create(data: CreateCompanyDto) {
    const company = this.companyRepo.create(data);
    const newCompany = await this.validateReferences(data, company);
    return this.companyRepo.save(newCompany);
  }

  async findAllNames(params?: FilterCompaniesDto) {
    return await this.companyRepo.find({
      select: ['name', 'nit', 'id'],
    });
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

  async findOne(id: number) {
    const company = await this.companyRepo.findOne({
      where: {
        id,
      },
      relations: ['userTemplate', 'users'],
    });

    if (!company) {
      throw new HttpException('Company not exist', HttpStatus.NOT_FOUND);
    }

    return company;
  }

  async update(id: number, changes: UpdateCompanyDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const company = await this.findOne(id);
      this.companyRepo.merge(company, changes);
      const newCompany = await this.validateReferences(changes, company);
      const userUpdated = await queryRunner.manager.save(newCompany);
      await queryRunner.commitTransaction();
      return userUpdated;
    } catch (err) {
      console.log('Update Company transaction failed');
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  remove(id: number) {
    return `This action removes a #${id} company`;
  }

  async batchRemove({ key }: { key: number[] }) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await key.reduce(async (antPromise, item) => {
        await antPromise;
        const company = await this.findOne(item);
        const { users } = company;
        if (users.length > 0) {
          console.log(company.id, users);
          throw new HttpException(
            `Please remove any users from the company: ${company.name}, first.`,
            HttpStatus.PRECONDITION_FAILED,
          );
        }

        this.companyRepo.delete(item);
      }, Promise.resolve());

      await queryRunner.commitTransaction();
      return { success: true };
    } catch (err) {
      console.log('Delete Companies transaction failed');
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
