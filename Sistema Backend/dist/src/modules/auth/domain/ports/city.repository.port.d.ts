export declare const CITY_REPOSITORY: unique symbol;
export interface CitySummary {
    id: string;
    name: string;
}
export interface CityRepositoryPort {
    findActiveById(id: string): Promise<CitySummary | null>;
    findActiveByName(name: string): Promise<CitySummary | null>;
    ensureActiveByName(name: string): Promise<CitySummary>;
}
