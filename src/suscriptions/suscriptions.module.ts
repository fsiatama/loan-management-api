import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuscriptionsService } from './suscriptions.service';
import { SuscriptionsController } from './suscriptions.controller';
import { Product } from '../products/entities/product.entity';
import { Country } from '../countries/entities/country.entity';
import { User } from '../users/entities/user.entity';
import { Suscription } from './entities/suscription.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Suscription, User, Country, Product])],
  controllers: [SuscriptionsController],
  providers: [SuscriptionsService],
})
export class SuscriptionsModule {}
