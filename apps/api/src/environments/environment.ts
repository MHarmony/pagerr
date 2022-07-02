import 'dotenv/config';

export const environment = {
  production: false,
  port: process.env['PORT'],
  db: {
    host: process.env['POSTGRES_HOST'],
    port: +process.env['POSTGRES_PORT'],
    user: process.env['POSTGRES_USER'],
    pass: process.env['POSTGRES_PASSWORD'],
    database: process.env['POSTGRES_DB']
  }
};
