import { Module } from '@nestjs/common';
import { EmailConfirmationController } from './controller/email-confirmation.controller';
import { EmailConfirmationService } from './service/email-confirmation.service';

@Module({
  providers: [EmailConfirmationService],
  controllers: [EmailConfirmationController]
})
export class EmailConfirmationModule {}
