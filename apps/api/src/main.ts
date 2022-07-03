import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { CustomLogger } from './log/logger/custom-logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true
  });

  app.useLogger(app.get(CustomLogger));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      disableErrorMessages: environment.production,
      whitelist: true
    })
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.use(cookieParser());
  app.use(compression());
  app.use(helmet());

  app.enableCors({
    origin: environment.frontendUrl,
    credentials: true
  });
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1'
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('pagerr API')
    .setDescription('API for the pagerr book tracking application')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api', app, document);

  await app.listen(environment.port);
}

bootstrap();
