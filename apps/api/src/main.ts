import fastifyCompress from '@fastify/compress';
import fastifyCors from '@fastify/cors';
import fastifyCsrf from '@fastify/csrf-protection';
import fastifyHelmet from '@fastify/helmet';
import fastifySecureSession from '@fastify/secure-session';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { readFileSync } from 'fs';
import { resolve } from 'path';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      http2: true,
      https: {
        ca: readFileSync(resolve(__dirname, '../../../certs/ca.crt')),
        cert: readFileSync(resolve(__dirname, '../../../certs/api.crt')),
        key: readFileSync(resolve(__dirname, '../../../certs/api.key')),
        dhparam: readFileSync(resolve(__dirname, '../../../certs/api.dhparam')),
        minVersion: 'TLSv1.2',
        ecdhCurve: 'prime256v1',
        honorCipherOrder: true
      }
    })
  );
  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      disableErrorMessages: configService.get<string>('NODE_ENV') === 'production',
      whitelist: true
    })
  );
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1'
  });

  app.register(fastifyHelmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [`'self'`],
        styleSrc: [`'self'`, `'unsafe-inline'`],
        imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
        scriptSrc: [`'self'`, `https: 'unsafe-inline'`]
      }
    }
  });
  await app.register(fastifyCors, {
    origin: '*',
    credentials: true
  });
  await app.register(fastifySecureSession, {
    cookie: {
      httpOnly: true,
      secure: true,
      signed: true
    },
    secret: configService.get<string>('SESSION_SECRET'),
    salt: configService.get<string>('SESSION_SALT')
  });
  await app.register(fastifyCsrf, {
    sessionPlugin: '@fastify/secure-session'
  });
  await app.register(fastifyCompress);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('pagerr API')
    .setDescription('API for the pagerr book tracking application')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'pagerr - API Documentation',
    swaggerOptions: {
      deepLinking: true,
      filter: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha'
    }
  });

  await app.listen(configService.get<number>('PORT'));
}

bootstrap();
