export declare const HEALTH_REPOSITORY: unique symbol;
export interface HealthRepositoryPort {
    pingDatabase(): Promise<boolean>;
}
