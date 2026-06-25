import type { UseCase } from "../../../../shared/application/use-case.interface";
import type { HealthStatus } from '../../domain/entities/health-status.entity';
import { type HealthRepositoryPort } from '../../domain/ports/health.repository.port';
export declare class GetHealthUseCase implements UseCase<void, HealthStatus> {
    private readonly healthRepository;
    constructor(healthRepository: HealthRepositoryPort);
    execute(): Promise<HealthStatus>;
}
