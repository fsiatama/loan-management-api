import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { Country } from '../countries/entities/country.entity';
import { Company } from '../companies/entities/company.entity';
import { AzureB2cModule } from '../azure-b2c/azure-b2c.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Country, Company]),
    forwardRef((): typeof AzureB2cModule => AzureB2cModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
