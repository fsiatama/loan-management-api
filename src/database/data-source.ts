import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { URL } from 'url';
import { config } from 'dotenv';

config();

const configService = new ConfigService();

const dbUrl = new URL(configService.get('DATABASE_URL'));
const routingId = dbUrl.searchParams.get('options');
dbUrl.searchParams.delete('options');

export const AppDataSource = new DataSource({
  type: 'cockroachdb',
  url: dbUrl.toString(),
  ssl: true,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/database/migrations/*.ts'],
  extra: {
    options: routingId,
  },
});
