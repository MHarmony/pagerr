import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { environment } from '../../environments/environment';
import { UserService } from '../../user/service/user.service';
import { TokenPayload } from '../interface/token-payload.interface';

@Injectable()
export class JwtTwoFactorStrategy extends PassportStrategy(Strategy, 'jwt-two-factor') {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Authentication;
        }
      ]),
      secretOrKey: environment.jwt.secret
    });
  }

  async validate(payload: TokenPayload) {
    const user = await this.userService.getById(payload.userId);

    if (!user.isTwoFactorAuthEnabled) {
      return user;
    }

    if (payload.isTwoFactorAuthenticated) {
      return user;
    }
  }
}
