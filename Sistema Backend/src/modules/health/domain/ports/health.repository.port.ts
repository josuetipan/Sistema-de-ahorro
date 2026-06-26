/** Token de inyección del puerto (hexagonal). */
export const HEALTH_REPOSITORY = Symbol('HEALTH_REPOSITORY');

export interface HealthRepositoryPort {
  pingDatabase(): Promise<boolean>;
}
