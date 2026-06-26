import { Inject, Injectable } from '@nestjs/common';
import type { UseCase } from '@shared/application/use-case.interface';
import type { HealthStatus } from '../../domain/entities/health-status.entity';
import {
  HEALTH_REPOSITORY,
  type HealthRepositoryPort,
} from '../../domain/ports/health.repository.port';

@Injectable()
export class GetHealthUseCase implements UseCase<void, HealthStatus> {
  constructor(
    @Inject(HEALTH_REPOSITORY)
    private readonly healthRepository: HealthRepositoryPort,
  ) {}

  async execute(): Promise<HealthStatus> {
    const databaseOk = await this.healthRepository.pingDatabase();

    return {
      status: databaseOk ? 'ok' : 'degraded',
      service: 'finnova-api',
      database: databaseOk ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
    };
  }
}
