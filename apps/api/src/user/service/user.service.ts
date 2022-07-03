import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcrypt';
import { Cache } from 'cache-manager';
import { DataSource, Repository, UpdateResult } from 'typeorm';
import { DatabaseFileService } from '../../database-file/service/database-file.service';
import { GET_USERS_CACHE_KEY } from '../constants/user.constants';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserEntity } from '../entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly databaseFileService: DatabaseFileService,
    private readonly datasource: DataSource,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  public async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const newUser = this.userRepository.create(createUserDto);

    await this.userRepository.save(newUser);

    return newUser;
  }

  public async get(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  public async getByEmail(email: string): Promise<UserEntity> {
    const user = this.userRepository.findOneBy({ email });

    if (user) {
      return user;
    }

    throw new NotFoundException('User with this email does not exist');
  }

  public async getById(id: string): Promise<UserEntity> {
    const user = this.userRepository.findOneBy({ id });

    if (user) {
      return user;
    }

    throw new NotFoundException('User with this ID does not exist');
  }

  public async getByUsername(username: string): Promise<UserEntity> {
    const user = this.userRepository.findOneBy({ username });

    if (user) {
      return user;
    }

    throw new NotFoundException('User with this username does not exist');
  }

  public async update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    await this.userRepository.update(id, updateUserDto);

    const updatedUser = await this.userRepository.findOneBy({ id });

    if (updatedUser) {
      await this.clearCache();

      return updatedUser;
    }

    throw new NotFoundException('User with this ID does not exist');
  }

  public async delete(id: string): Promise<void> {
    const deleteResponse = await this.userRepository.delete(id);

    if (!deleteResponse.affected) {
      throw new NotFoundException('User with this ID does not exist');
    }

    await this.clearCache();
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

  public async setTwoFactorAuthSecret(secret: string, id: string) {
    return this.userRepository.update(id, {
      twoFactorAuthSecret: secret
    });
  }

  public async turnOnTwoFactorAuth(id: string) {
    return this.userRepository.update(id, {
      isTwoFactorAuthEnabled: true
    });
  }

  public async addAvatar(
    id: string,
    imageBuffer: Buffer,
    filename: string
  ): Promise<void> {
    const queryRunner = this.datasource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await queryRunner.manager.findOneBy(UserEntity, { id });
      const currentAvatarId = user.avatarId;
      const avatar = await this.databaseFileService.uploadWithQueryRunner(
        imageBuffer,
        filename,
        queryRunner
      );

      await queryRunner.manager.update(UserEntity, id, {
        avatarId: avatar.id
      });

      if (currentAvatarId) {
        await this.databaseFileService.deleteWithQueryRunner(
          currentAvatarId,
          queryRunner
        );
      }

      await queryRunner.commitTransaction();
    } catch {
      await queryRunner.rollbackTransaction();

      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }
  }

  private async clearCache() {
    const keys = await this.cacheManager.store.keys();

    keys.forEach((key: string) => {
      if (key.startsWith(GET_USERS_CACHE_KEY)) {
        this.cacheManager.del(key);
      }
    });
  }
}
