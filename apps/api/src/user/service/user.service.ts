import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcrypt';
import { Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserEntity } from '../entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  public async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const newUser = this.userRepository.create(createUserDto);

    await this.userRepository.save(newUser);

    return newUser;
  }

  public async getByEmail(email: string): Promise<UserEntity> {
    const user = this.userRepository.findOneBy({ email });

    if (user) {
      return user;
    }

    throw new HttpException(
      'User with this email does not exist',
      HttpStatus.NOT_FOUND
    );
  }

  public async getById(id: string): Promise<UserEntity> {
    const user = this.userRepository.findOneBy({ id });

    if (user) {
      return user;
    }

    throw new HttpException('User with this ID does not exist', HttpStatus.NOT_FOUND);
  }

  public async getByUsername(username: string): Promise<UserEntity> {
    const user = this.userRepository.findOneBy({ username });

    if (user) {
      return user;
    }

    throw new HttpException(
      'User with this username does not exist',
      HttpStatus.NOT_FOUND
    );
  }

  public async setCurrentRefreshToken(refreshToken: string, id: string): Promise<void> {
    const hashedRefreshToken = await hash(refreshToken, 10);

    await this.userRepository.update(id, {
      hashedRefreshToken
    });
  }

  public async getUserIfRefreshTokenMatches(
    refreshToken: string,
    id: string
  ): Promise<UserEntity> {
    const user = await this.getById(id);

    const isRefreshTokenMatching = await compare(refreshToken, user.hashedRefreshToken);

    if (isRefreshTokenMatching) {
      return user;
    }
  }

  public async removeRefreshToken(id: string): Promise<UpdateResult> {
    return this.userRepository.update(id, {
      hashedRefreshToken: null
    });
  }

  public async markEmailAsConfirmed(email: string): Promise<UpdateResult> {
    return this.userRepository.update(
      { email },
      {
        isEmailConfirmed: true
      }
    );
  }
}
