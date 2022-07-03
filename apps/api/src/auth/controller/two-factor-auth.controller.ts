import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards
} from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { Response } from 'express';
import { UserEntity } from '../../user/entity/user.entity';
import { UserService } from '../../user/service/user.service';
import { TwoFactorAuthCodeDto } from '../dto/two-factor-auth-code.dto';
import { JwtGuard } from '../guard/jwt.guard';
import { RequestWithUser } from '../interface/request-with-user.interface';
import { AuthService } from '../service/auth.service';
import { TwoFactorAuthService } from '../service/two-factor-auth.service';

@Controller('twoFactorAuth')
@ApiExcludeController()
export class TwoFactorAuthController {
  constructor(
    private readonly twoFactorAuthService: TwoFactorAuthService,
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) {}

  @Post('generate')
  @UseGuards(JwtGuard)
  public async register(
    @Res() response: Response,
    @Req() request: RequestWithUser
  ): Promise<unknown> {
    const { otpAuthUrl } = await this.twoFactorAuthService.generateTwoFactorAuthSecret(
      request.user
    );

    return this.twoFactorAuthService.pipeQrCodeStream(response, otpAuthUrl);
  }

  @Post('turnOn')
  @HttpCode(200)
  @UseGuards(JwtGuard)
  public async turnOnTwoFactorAuth(
    @Req() request: RequestWithUser,
    @Body() { twoFactorAuthCode }: TwoFactorAuthCodeDto
  ): Promise<void> {
    const isCodeValid = this.twoFactorAuthService.isTwoFactorAuthCodeValid(
      twoFactorAuthCode,
      request.user
    );

    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }

    await this.userService.turnOnTwoFactorAuth(request.user.id);
  }

  @Post('authenticate')
  @HttpCode(200)
  @UseGuards(JwtGuard)
  public async authenticate(
    @Req() request: RequestWithUser,
    @Body() { twoFactorAuthCode }: TwoFactorAuthCodeDto
  ): Promise<UserEntity> {
    const isCodeValid = this.twoFactorAuthService.isTwoFactorAuthCodeValid(
      twoFactorAuthCode,
      request.user
    );

    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }

    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      request.user.id,
      true
    );

    request.res.setHeader('Set-Cookie', [accessTokenCookie]);

    return request.user;
  }
}
