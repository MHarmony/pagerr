import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { EmailModule } from '../email/email.module';
import { UserModule } from '../user/user.module';
import { EmailConfirmationController } from './controller/email-confirmation.controller';
import { EmailConfirmationService } from './service/email-confirmation.service';

@Module({
  imports: [EmailModule, JwtModule.register({}), UserModule],
  providers: [EmailConfirmationService],
  controllers: [EmailConfirmationController],
  exports: [EmailConfirmationService]
})
export class EmailConfirmationModule {}
