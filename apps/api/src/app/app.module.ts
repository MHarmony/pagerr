import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development', '.env.test', '.env.production'],
      cache: true,
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'test', 'production')
          .default('development')
          .required(),
        PORT: Joi.number().default(3000).required(),
        SESSION_SECRET: Joi.string().length(32).required(),
        SESSION_SALT: Joi.string().length(16).required()
      }),
      validationOptions: {
        abortEarly: true
      }
    })
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor
    }
  ]
})
export class AppModule {}
