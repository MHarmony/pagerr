import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { DatabaseFileEntity } from '../entity/database-file.entity';

@Injectable()
export class DatabaseFileService {
  constructor(
    @InjectRepository(DatabaseFileEntity)
    private databaseFileRepository: Repository<DatabaseFileEntity>
  ) {}

  public async uploadWithQueryRunner(
    dataBuffer: Buffer,
    filename: string,
    queryRunner: QueryRunner
  ): Promise<DatabaseFileEntity> {
    const newFile = queryRunner.manager.create(DatabaseFileEntity, {
      filename,
      data: dataBuffer
    });

    await queryRunner.manager.save(DatabaseFileEntity, newFile);

    return newFile;
  }

  public async deleteWithQueryRunner(
    id: string,
    queryRunner: QueryRunner
  ): Promise<void> {
    const deleteResponse = await queryRunner.manager.delete(DatabaseFileEntity, id);

    if (!deleteResponse.affected) {
      throw new NotFoundException();
    }
  }

  public async getById(id: string): Promise<DatabaseFileEntity> {
    const file = await this.databaseFileRepository.findOneBy({ id });

    if (!file) {
      throw new NotFoundException();
    }

    return file;
  }
}
