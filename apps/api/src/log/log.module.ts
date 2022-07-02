import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogEntity } from './entity/log.entity';
import { CustomLogger } from './logger/custom-logger';
import { LogService } from './service/log.service';

@Module({
  imports: [TypeOrmModule.forFeature([LogEntity])],
  providers: [CustomLogger, LogService],
  exports: [CustomLogger]
})
export class LogModule {}
