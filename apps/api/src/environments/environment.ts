import 'dotenv/config';

export const environment = {
  production: false,
  port: process.env['PORT'],
  db: {
    host: process.env['POSTGRES_HOST'],
    port: Number(process.env['POSTGRES_PORT']),
    user: process.env['POSTGRES_USER'],
    pass: process.env['POSTGRES_PASSWORD'],
    database: process.env['POSTGRES_DB']
  },
  jwt: {
    secret: process.env['JWT_ACCESS_TOKEN_SECRET'],
    expires: process.env['JWT_ACCESS_TOKEN_EXPIRES'],
    refresh: {
      secret: process.env['JWT_REFRESH_TOKEN_SECRET'],
      expires: process.env['JWT_REFRESH_TOKEN_EXPIRES']
    },
    verification: {
      secret: process.env['JWT_VERIFICATION_TOKEN_SECRET'],
      expires: process.env['JWT_VERIFICATION_TOKEN_EXPIRES']
    }
  },
  frontendUrl: 'http://localhost:4200',
  throttler: {
    ttl: Number(process.env['THROTTLER_TTL']),
    limit: Number(process.env['THROTTLER_LIMIT'])
  },
  email: {
    service: process.env['EMAIL_SERVICE'],
    auth: {
      user: process.env['EMAIL_USER'],
      pass: process.env['EMAIL_PASSWORD']
    },
    confirmationUrl: 'http://localhost:4200/confirm-email'
  }
};
