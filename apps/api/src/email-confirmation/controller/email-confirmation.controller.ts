import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { JwtGuard } from '../../auth/guard/jwt.guard';
import { RequestWithUser } from '../../auth/interface/request-with-user.interface';
import { ConfirmEmailDto } from '../dto/confirm-email.dto';
import { EmailConfirmationService } from '../service/email-confirmation.service';

@Controller('emailConfirmation')
@ApiExcludeController()
export class EmailConfirmationController {
  constructor(private readonly emailConfirmationService: EmailConfirmationService) {}

  @Post('confirm')
  async confirm(@Body() confirmEmailDto: ConfirmEmailDto): Promise<void> {
    const email = await this.emailConfirmationService.decodeConfirmationToken(
      confirmEmailDto.token
    );

    await this.emailConfirmationService.confirmEmail(email);
  }

  @Post('resendConfirmationLink')
  @UseGuards(JwtGuard)
  async resendConfirmationLink(@Req() request: RequestWithUser): Promise<void> {
    await this.emailConfirmationService.resendConfirmationLink(request.user.id);
  }
}
