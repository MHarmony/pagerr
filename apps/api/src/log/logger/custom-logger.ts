import { ConsoleLogger, Injectable } from '@nestjs/common';
import { ConsoleLoggerOptions } from '@nestjs/common/services/console-logger.service';
import { getLogLevels } from '../../util/get-log-levels/get-log-levels';
import { LogService } from '../service/log.service';

@Injectable()
export class CustomLogger extends ConsoleLogger {
  private readonly logService: LogService;

  constructor(context: string, options: ConsoleLoggerOptions, logService: LogService) {
    const environment = process.env['NODE_ENV'];

    super(context, {
      ...options,
      logLevels: getLogLevels(environment === 'production')
    });

    this.logService = logService;
  }

  public log(message: string, context?: string): void {
    super.log.apply(this, [message, context]);

    this.logService.create({
      message,
      context,
      level: 'log'
    });
  }

  public error(message: string, context?: string, stack?: string): void {
    super.error.apply(this, [message, context, stack]);

    this.logService.create({
      message,
      context,
      level: 'error'
    });
  }

  public warn(message: string, context?: string): void {
    super.warn.apply(this, [message, context]);

    this.logService.create({
      message,
      context,
      level: 'error'
    });
  }

  public debug(message: string, context?: string): void {
    super.debug.apply(this, [message, context]);

    this.logService.create({
      message,
      context,
      level: 'error'
    });
  }

  public verbose(message: string, context?: string): void {
    super.debug.apply(this, [message, context]);

    this.logService.create({
      message,
      context,
      level: 'error'
    });
  }
}
