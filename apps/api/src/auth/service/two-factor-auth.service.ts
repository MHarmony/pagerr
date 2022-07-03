import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { authenticator } from 'otplib';
import { toFileStream } from 'qrcode';
import { environment } from '../../environments/environment';
import { UserEntity } from '../../user/entity/user.entity';
import { UserService } from '../../user/service/user.service';

@Injectable()
export class TwoFactorAuthService {
  constructor(private readonly userService: UserService) {}

  public async generateTwoFactorAuthSecret(
    user: UserEntity
  ): Promise<{ secret: string; otpAuthUrl: string }> {
    const secret = authenticator.generateSecret();
    const otpAuthUrl = authenticator.keyuri(
      user.email,
      environment.twoFactor.appName,
      secret
    );

    await this.userService.setTwoFactorAuthSecret(secret, user.id);

    return {
      secret,
      otpAuthUrl
    };
  }

  public isTwoFactorAuthCodeValid(
    twoFactorAuthenticationCode: string,
    user: UserEntity
  ): boolean {
    return authenticator.verify({
      token: twoFactorAuthenticationCode,
      secret: user.twoFactorAuthSecret
    });
  }

  public async pipeQrCodeStream(
    stream: Response,
    otpauthUrl: string
  ): Promise<unknown> {
    return toFileStream(stream, otpauthUrl);
  }
}
