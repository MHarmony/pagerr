import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  TypeOrmHealthIndicator
} from '@nestjs/terminus';

@Controller('health')
@ApiTags('health')
export class HealthController {
  constructor(
    private healthCheckService: HealthCheckService,
    private typeOrmHealthIndicator: TypeOrmHealthIndicator
  ) {}

  @Get()
  @ApiOperation({
    description: 'Get the health of pagerr services',
    summary: 'Get the health of pagerr services'
  })
  @HealthCheck()
  public check(): Promise<HealthCheckResult> {
    return this.healthCheckService.check([
      () => this.typeOrmHealthIndicator.pingCheck('database')
    ]);
  }
}
