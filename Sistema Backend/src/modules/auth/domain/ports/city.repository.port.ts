export const CITY_REPOSITORY = Symbol('CITY_REPOSITORY');

export interface CitySummary {
  id: string;
  name: string;
}

export interface CityRepositoryPort {
  findActiveById(id: string): Promise<CitySummary | null>;
  /** Para admins internos (ej. ciudad "Sistema" del seed). */
  findActiveByName(name: string): Promise<CitySummary | null>;
  /**
   * Crea o reactiva la ciudad por nombre (upsert). Evita fallar si no corriste el seed.
   */
  ensureActiveByName(name: string): Promise<CitySummary>;
}
