import { Logger } from '@nestjs/common';
import { Logger as TypeOrmLogger, QueryRunner } from 'typeorm';

export class DatabaseLogger implements TypeOrmLogger {
  private readonly logger = new Logger('SQL');

  public logQuery(query: string, params?: unknown[], queryRunner?: QueryRunner): void {
    if (queryRunner?.data?.isCreatingLogs) {
      return;
    }

    this.logger.log(`${query} -- Parameters: ${this.stringifyParams(params)}`);
  }

  public logQueryError(
    error: string,
    query: string,
    params?: unknown[],
    queryRunner?: QueryRunner
  ): void {
    if (queryRunner?.data?.isCreatingLogs) {
      return;
    }

    this.logger.error(
      `${query} -- Parameters: ${this.stringifyParams(params)} -- ${error}`
    );
  }

  public logQuerySlow(
    time: number,
    query: string,
    params?: unknown[],
    queryRunner?: QueryRunner
  ): void {
    if (queryRunner?.data?.isCreatingLogs) {
      return;
    }

    this.logger.warn(
      `Time: ${time} -- Parameters: ${this.stringifyParams(params)} -- ${query}`
    );
  }

  public logMigration(message: string): void {
    this.logger.log(message);
  }

  public logSchemaBuild(message: string): void {
    this.logger.log(message);
  }

  public log(
    level: 'log' | 'info' | 'warn',
    message: string,
    queryRunner?: QueryRunner
  ): void {
    if (queryRunner?.data?.isCreatingLogs) {
      return;
    }
    if (level === 'log') {
      return this.logger.log(message);
    }
    if (level === 'info') {
      return this.logger.debug(message);
    }
    if (level === 'warn') {
      return this.logger.warn(message);
    }
  }

  private stringifyParams(parameters?: unknown[]): string {
    try {
      return JSON.stringify(parameters);
    } catch {
      return '';
    }
  }
}
