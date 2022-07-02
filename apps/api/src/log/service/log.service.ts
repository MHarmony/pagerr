import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLogDto } from '../dto/create-log.dto';
import { LogEntity } from '../entity/log.entity';

@Injectable()
export class LogService {
  constructor(
    @InjectRepository(LogEntity) private logRepository: Repository<LogEntity>
  ) {}

  public async create(createLogDto: CreateLogDto): Promise<LogEntity> {
    const newLog = this.logRepository.create(createLogDto);

    await this.logRepository.save(newLog, {
      data: {
        isCreatingLogs: true
      }
    });

    return newLog;
  }
}
