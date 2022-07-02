import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserEntity } from '../../user/entity/user.entity';
import { AuthService } from '../service/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameFiend: 'username' });
  }

  public async validate(username: string, password: string): Promise<UserEntity> {
    return this.authService.getAuthenticatedUser(username, password);
  }
}
