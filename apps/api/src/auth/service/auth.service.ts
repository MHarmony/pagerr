import {
  BadRequestException,
  Injectable,
  InternalServerErrorException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { PostgresErrorCode } from '../../database/enum/postgres-error-code.enum';
import { environment } from '../../environments/environment';
import { UserEntity } from '../../user/entity/user.entity';
import { UserService } from '../../user/service/user.service';
import { RegisterDto } from '../dto/register.dto';
import { TokenPayload } from '../interface/token-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  public async register(registerDto: RegisterDto): Promise<UserEntity> {
    const hashedPassword = await hash(registerDto.password, 10);

    try {
      const createdUser = await this.userService.create({
        ...registerDto,
        password: hashedPassword
      });
      createdUser.password = undefined;

      return createdUser;
    } catch (err) {
      if (err.code === PostgresErrorCode.UNIQUE_VIOLATION) {
        throw new BadRequestException(
          'User with that username or email already exists'
        );
      }

      throw new InternalServerErrorException(
        'An error occurred while creating the user'
      );
    }
  }

  public getCookieWithJwtAccessToken(
    userId: string,
    isTwoFactorAuthenticated = false
  ): string {
    const payload: TokenPayload = { userId, isTwoFactorAuthenticated };
    const token = this.jwtService.sign(payload, {
      secret: environment.jwt.secret,
      expiresIn: `${environment.jwt.expires}s`
    });

    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${environment.jwt.expires}`;
  }

  public getCookieWithJwtRefreshToken(userId: string): {
    cookie: string;
    token: string;
  } {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: environment.jwt.refresh.secret,
      expiresIn: `${environment.jwt.refresh.expires}s`
    });
    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${environment.jwt.refresh.expires}`;

    return {
      cookie,
      token
    };
  }

  public getCookiesForLogOut(): string[] {
    return [
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0'
    ];
  }

  public async getAuthenticatedUser(
    username: string,
    password: string
  ): Promise<UserEntity> {
    try {
      const user = await this.userService.getByUsername(username);

      await this.verifyPassword(password, user.password);

      return user;
    } catch (err) {
      throw new BadRequestException('Wrong credentials provided');
    }
  }

  public async getUserFromAuthenticationToken(token: string) {
    const payload: TokenPayload = this.jwtService.verify(token, {
      secret: environment.jwt.secret
    });

    if (payload.userId) {
      return this.userService.getById(payload.userId);
    }
  }

  private async verifyPassword(
    password: string,
    hashedPassword: string
  ): Promise<void> {
    const isPasswordMatching = await compare(password, hashedPassword);

    if (!isPasswordMatching) {
      throw new BadRequestException('Wrong credentials provided');
    }
  }
}
