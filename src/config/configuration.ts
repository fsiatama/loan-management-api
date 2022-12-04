export default () => ({
  port: parseInt(process.env.AUTH_API_PORT, 10) || 3000,
  database: {
    host: process.env.DB_SERVER,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
    dbName: 'sicex_r',
  },
});
