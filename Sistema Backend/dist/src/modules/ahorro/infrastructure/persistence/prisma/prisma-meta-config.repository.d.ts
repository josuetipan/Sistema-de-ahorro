import { PrismaService } from "../../../../../shared/infrastructure/prisma/prisma.service";
import type { ActualizarMetaConfigInput, MetaConfig, MetaConfigRepositoryPort } from '../../../domain/ports/meta-config.repository.port';
export declare class PrismaMetaConfigRepository implements MetaConfigRepositoryPort {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getOrCreate(): Promise<MetaConfig>;
    actualizar(input: ActualizarMetaConfigInput): Promise<MetaConfig>;
}
