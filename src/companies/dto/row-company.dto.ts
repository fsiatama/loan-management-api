import { Company } from '../entities/company.entity';

export class RowCompanyDto extends Company {
  totalUsersCount: number;
}
