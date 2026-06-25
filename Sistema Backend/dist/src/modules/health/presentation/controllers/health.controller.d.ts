import { GetHealthUseCase } from '../../application/use-cases/get-health.use-case';
export declare class HealthController {
    private readonly getHealthUseCase;
    constructor(getHealthUseCase: GetHealthUseCase);
    health(): Promise<import("../../domain/entities/health-status.entity").HealthStatus>;
}
