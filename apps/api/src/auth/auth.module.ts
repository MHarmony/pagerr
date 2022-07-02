import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { EmailConfirmationModule } from '../email-confirmation/email-confirmation.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { JwtRefreshTokenStrategy } from './strategy/jwt-refresh-token.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { LocalStrategy } from './strategy/local.strategy';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({}),
    EmailConfirmationModule
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtRefreshTokenStrategy],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}
