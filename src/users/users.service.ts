import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindManyOptions, Like, Not, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { FilterUsersDto } from './dto/filter-users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
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
    return newUser;
  }

  async create(data: CreateUserDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = this.userRepo.create(data);
      const newUser = await this.validateReferences(data, user);
      const hashPassword = await bcrypt.hash(newUser.password, 10);
      newUser.password = hashPassword;
      const userCreated = await queryRunner.manager.save(newUser);
      await queryRunner.commitTransaction();
      return userCreated;
    } catch (err) {
      console.log('Create User transaction failed');
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
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
        { firstName: Like(`%${firstName}%`) },
        { lastName: Like(`%${lastName}%`) },
        { email: Like(`%${name}%`) },
        { username: Like(`%${name}%`) },
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

  async batchRemove({ key }: { key: number[] }) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await key.reduce(async (antPromise, item) => {
        await antPromise;
        const user = await this.findOne(item);
        this.userRepo.delete(item);
      }, Promise.resolve());

      await queryRunner.commitTransaction();
      return { success: true };
    } catch (err) {
      console.log('Delete Users transaction failed');
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
