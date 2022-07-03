import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseFileModule } from '../database-file/database-file.module';
import { UserController } from './controller/user.controller';
import { UserEntity } from './entity/user.entity';
import { UserService } from './service/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), DatabaseFileModule],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController]
})
export class UserModule {}
