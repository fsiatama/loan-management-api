import { registerAs } from '@nestjs/config';

export default registerAs('config', () => ({
  port: parseInt(process.env.AUTH_API_PORT, 10) || 3000,
  apiKey: 'test_api_key',
  jwtSecret: process.env.JWT_SECRET,
  database: {
    host: process.env.DB_SERVER,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT, 10) || 26257,
    dbName: process.env.DB_NAME,
  },
  coreBusiness: {
    paymentConceptId: process.env.PAYMENT_CONCEPT_ID,
  },
}));
