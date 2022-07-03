import { CacheModule, MiddlewareConsumer, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from '../auth/auth.module';
import { DatabaseFileModule } from '../database-file/database-file.module';
import { DatabaseModule } from '../database/database.module';
import { EmailConfirmationModule } from '../email-confirmation/email-confirmation.module';
import { EmailModule } from '../email/email.module';
import { environment } from '../environments/environment';
import { HealthModule } from '../health/health.module';
import { LogModule } from '../log/log.module';
import { LogMiddleware } from '../middleware/log/log.middleware';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: environment.throttler.ttl,
      limit: environment.throttler.limit
    }),
    CacheModule.register(),
    DatabaseModule,
    EmailModule,
    EmailConfirmationModule,
    UserModule,
    AuthModule,
    LogModule,
    HealthModule,
    DatabaseFileModule
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LogMiddleware).forRoutes('*');
  }
}
