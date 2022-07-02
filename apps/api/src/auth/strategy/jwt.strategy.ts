import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { environment } from '../../environments/environment';
import { UserEntity } from '../../user/entity/user.entity';
import { UserService } from '../../user/service/user.service';
import { TokenPayload } from '../interface/token-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
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

  public async validate(payload: TokenPayload): Promise<UserEntity> {
    return this.userService.getById(payload.userId);
  }
}
