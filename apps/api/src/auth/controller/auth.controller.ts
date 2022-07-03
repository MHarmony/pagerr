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
import {
  ApiBody,
  ApiExcludeEndpoint,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger';
import { UserEntity } from '../../user/entity/user.entity';
import { UserService } from '../../user/service/user.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { JwtRefreshTokenGuard } from '../guard/jwt-refresh-token.guard';
import { JwtGuard } from '../guard/jwt.guard';
import { LocalGuard } from '../guard/local.guard';
import { RequestWithUser } from '../interface/request-with-user.interface';
import { AuthService } from '../service/auth.service';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  @Post('register')
  @ApiExcludeEndpoint()
  public async register(@Body() registerDto: RegisterDto): Promise<UserEntity> {
    return this.authService.register(registerDto);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalGuard)
  @Post('login')
  @ApiOperation({ description: 'Log in a user', summary: 'Log in a user' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ description: 'Successfully logged in', type: UserEntity })
  @ApiInternalServerErrorResponse({ description: 'An error occurred while logging in' })
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
  @ApiOperation({ description: 'Log out a user', summary: 'Log out a user' })
  @ApiOkResponse({ description: 'Successfully logged out' })
  @ApiInternalServerErrorResponse({
    description: 'An error occurred while logging out'
  })
  public async logout(@Req() request: RequestWithUser): Promise<void> {
    await this.userService.removeRefreshToken(request.user.id);
    request.res.setHeader('Set-Cookie', this.authService.getCookiesForLogOut());
  }

  @UseGuards(JwtGuard)
  @Get()
  @ApiOperation({ description: 'Authenticate a user', summary: 'Authenticate a user' })
  @ApiOkResponse({
    description: 'Successfully authenticated the user',
    type: UserEntity
  })
  @ApiInternalServerErrorResponse({
    description: 'An error occurred while authenticating the user'
  })
  public authenticate(@Req() request: RequestWithUser): UserEntity {
    return request.user;
  }

  @UseGuards(JwtRefreshTokenGuard)
  @Get('refresh')
  @ApiOperation({
    description: "Refresh a user's access",
    summary: "Refresh a user's access"
  })
  @ApiOkResponse({
    description: "Successfully refreshed the user's access",
    type: UserEntity
  })
  @ApiInternalServerErrorResponse({
    description: "An error occurred while refreshing the user's access"
  })
  public refresh(@Req() request: RequestWithUser): UserEntity {
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      request.user.id
    );

    request.res.setHeader('Set-Cookie', accessTokenCookie);

    return request.user;
  }
}
