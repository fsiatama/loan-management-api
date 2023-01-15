import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Brackets, Repository } from 'typeorm';
import { addYears, subYears } from 'date-fns';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { Subscription } from './entities/subscription.entity';
import { FilterSubscriptionsDto } from './dto/filter-subscriptions.dto';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionRepo: Repository<Subscription>,
  ) {}

  create(createSubscriptionDto: CreateSubscriptionDto) {
    return 'This action adds a new subscription';
  }

  async findAll(params: FilterSubscriptionsDto) {
    const { pageSize = 20, current = 1, id, finalDate, initialDate } = params;

    const AfterDate = (date: Date) => Between(date, addYears(date, 100));
    const BeforeDate = (date: Date) => Between(subYears(date, 100), date);

    const postWithRepositoryQueryBuilder = this.subscriptionRepo
      .createQueryBuilder('subscription')
      .select([
        'subscription',
        'user.username',
        'user.email',
        'user.name',
        'user.lastName',
        'company.name',
        'company.nit',
      ])
      .leftJoin('subscription.user', 'user')
      .leftJoin('user.company', 'company')
      .leftJoinAndSelect('subscription.product', 'product')
      .where('subscription.id > 0');

    postWithRepositoryQueryBuilder.andWhere(
      new Brackets((qb) => {
        if (initialDate && finalDate) {
          qb.where({
            initialDate: AfterDate(new Date(initialDate)),
            finalDate: BeforeDate(new Date(finalDate)),
          });
        }
        if (id) {
          let [firstName, lastName] = id.split(' ');
          if (!lastName || !firstName) {
            lastName = id;
            firstName = id;
          }
          qb.andWhere(
            `(
              product.name LIKE(:name) OR 
              user.name LIKE(:firstName) OR 
              user.lastName LIKE(:lastName) OR 
              user.email LIKE(:name) OR 
              user.username LIKE(:name) OR 
              company.name LIKE(:name) OR
              company.nit LIKE(:name) 
             )`,
            {
              name: `%${id}%`,
              firstName: `%${firstName}%`,
              lastName: `%${lastName}%`,
            },
          );
        }
      }),
    );

    const [data, total] = await postWithRepositoryQueryBuilder
      .take(pageSize)
      .skip((current - 1) * pageSize)
      .getManyAndCount();

    return {
      data,
      current,
      pageSize,
      success: true,
      total,
    };
  }

  findByUser(id: number) {
    return this.subscriptionRepo.find({
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
    return `This action returns a #${id} subscription`;
  }

  update(id: number, updateSubscriptionDto: UpdateSubscriptionDto) {
    return `This action updates a #${id} subscription`;
  }

  remove(id: number) {
    return `This action removes a #${id} subscription`;
  }
}
