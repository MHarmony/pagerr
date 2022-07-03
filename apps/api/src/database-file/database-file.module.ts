import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseFileController } from './controller/database-file.controller';
import { DatabaseFileEntity } from './entity/database-file.entity';
import { DatabaseFileService } from './service/database-file.service';

@Module({
  imports: [TypeOrmModule.forFeature([DatabaseFileEntity])],
  providers: [DatabaseFileService],
  controllers: [DatabaseFileController],
  exports: [DatabaseFileService]
})
export class DatabaseFileModule {}
