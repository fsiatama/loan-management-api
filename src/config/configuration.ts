import { registerAs } from '@nestjs/config';

export default registerAs('config', () => ({
  port: parseInt(process.env.AUTH_API_PORT, 10) || 3000,
  apiKey: 'test_api_key',
  database: {
    host: process.env.DB_SERVER,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
    dbName: 'sicex_r',
  },
  credentials: {
    tenantName: process.env.TENANT_NAME,
    clientID: process.env.CLIENT_ID,
  },
  policies: {
    policyName: process.env.POLICY_NAME,
  },
  resource: {
    scope: ['tasks.read'],
  },
  metadata: {
    authority: 'login.microsoftonline.com',
    discovery: '.well-known/openid-configuration',
    version: 'v2.0',
  },
  settings: {
    isB2C: true,
    validateIssuer: true,
    passReqToCallback: false,
    loggingLevel: 'info',
  },
}));
