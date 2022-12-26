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
  azureMsal: {
    extensionsClientId: process.env.AZURE_B2C_EXTENSIONS_CLIENT_ID,
    auth: {
      clientId: process.env.AZURE_B2C_CLIENT_ID,
      authority: `https://login.microsoftonline.com/${process.env.AZURE_B2C_TENANT_ID}`,
      clientSecret: process.env.AZURE_B2C_CLIENT_SECRET,
    },
    tokenRequest: {
      scopes: ['https://graph.microsoft.com/.default'],
    },
  },
  azureAD: {
    credentials: {
      tenantName: process.env.AZURE_B2C_TENANT_NAME,
      clientID: process.env.AZURE_B2C_CLIENT_ID,
    },
    policies: {
      policyName: process.env.AZURE_B2C_POLICY_NAME,
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
  },
}));
