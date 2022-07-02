import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards
} from '@nestjs/common';
import { UserEntity } from '../../user/entity/user.entity';
import { UserService } from '../../user/service/user.service';
import { RegisterDto } from '../dto/register.dto';
import { JwtRefreshTokenGuard } from '../guard/jwt-refresh-token.guard';
import { JwtGuard } from '../guard/jwt.guard';
import { LocalGuard } from '../guard/local.guard';
import { RequestWithUser } from '../interface/request-with-user.interface';
import { AuthService } from '../service/auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  @Post('register')
  public async register(@Body() registerDto: RegisterDto): Promise<UserEntity> {
    return this.authService.register(registerDto);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalGuard)
  @Post('login')
  public async login(@Req() request: RequestWithUser): Promise<UserEntity> {
    const { user } = request;
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(user.id);
    const { cookie: refreshTokenCookie, token: refreshToken } =
      this.authService.getCookieWithJwtRefreshToken(user.id);

    await this.userService.setCurrentRefreshToken(refreshToken, user.id);
    request.res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);

    return user;
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  @Post('logout')
  public async logout(@Req() request: RequestWithUser): Promise<void> {
    await this.userService.removeRefreshToken(request.user.id);
    request.res.setHeader('Set-Cookie', this.authService.getCookiesForLogOut());
  }

  @UseGuards(JwtGuard)
  @Get()
  public authenticate(@Req() request: RequestWithUser): UserEntity {
    return request.user;
  }

  @UseGuards(JwtRefreshTokenGuard)
  @Get('refresh')
  public refresh(@Req() request: RequestWithUser): UserEntity {
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      request.user.id
    );

    request.res.setHeader('Set-Cookie', accessTokenCookie);

    return request.user;
  }
}
