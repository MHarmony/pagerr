import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      disableErrorMessages: environment.production,
      whitelist: true
    })
  );

  await app.listen(environment.port);
  Logger.log(`🚀 Application is running on: http://localhost:${environment.port}`);
}

bootstrap();
