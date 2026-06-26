import type { CityRepositoryPort, CitySummary } from '../../../domain/ports/city.repository.port';
import { PrismaService } from "../../../../../shared/infrastructure/prisma/prisma.service";
export declare class PrismaCityRepository implements CityRepositoryPort {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findActiveById(id: string): Promise<CitySummary | null>;
    findActiveByName(name: string): Promise<CitySummary | null>;
    ensureActiveByName(name: string): Promise<CitySummary>;
}
