import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as csurf from 'csurf';
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
  app.use(csurf());

  app.enableCors({
    origin: environment.frontendUrl,
    credentials: true
  });
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1'
  });

  await app.listen(environment.port);
}

bootstrap();
