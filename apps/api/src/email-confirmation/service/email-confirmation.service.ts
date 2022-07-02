import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../../email/service/email.service';
import { environment } from '../../environments/environment';
import { UserService } from '../../user/service/user.service';
import { VerificationTokenPayload } from '../interface/verification-token-payload.interface';

@Injectable()
export class EmailConfirmationService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly emailService: EmailService
  ) {}

  public sendVerificationLink(email: string): Promise<unknown> {
    const payload: VerificationTokenPayload = { email };
    const token = this.jwtService.sign(payload, {
      secret: environment.jwt.verification.secret,
      expiresIn: `${environment.jwt.verification.expires}s`
    });
    const url = `${environment.email.confirmationUrl}?token=${token}`;
    const text = `Welcome to pagerr. To confirm the email address, click here: ${url}`;

    return this.emailService.sendMail({
      to: email,
      subject: 'Email confirmation',
      text
    });
  }

  public async resendConfirmationLink(id: string): Promise<void> {
    const user = await this.userService.getById(id);

    if (user.isEmailConfirmed) {
      throw new BadRequestException('Email already confirmed');
    }

    await this.sendVerificationLink(user.email);
  }

  public async confirmEmail(email: string) {
    const user = await this.userService.getByEmail(email);

    if (user.isEmailConfirmed) {
      throw new BadRequestException('Email already confirmed');
    }

    await this.userService.markEmailAsConfirmed(email);
  }

  public async decodeConfirmationToken(token: string): Promise<string> {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: environment.jwt.verification.secret
      });

      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }

      throw new BadRequestException();
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token expired');
      }

      throw new BadRequestException('Bad confirmation token');
    }
  }
}
