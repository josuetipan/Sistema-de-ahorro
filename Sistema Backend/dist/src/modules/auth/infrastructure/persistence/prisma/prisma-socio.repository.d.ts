import type { CreateSocioPersistenceInput, CreatedSocioRecord, SocioRepositoryPort } from '../../../domain/ports/socio.repository.port';
import { PrismaService } from "../../../../../shared/infrastructure/prisma/prisma.service";
export declare class PrismaSocioRepository implements SocioRepositoryPort {
    private readonly prisma;
    constructor(prisma: PrismaService);
    existsByCodigo(codigo: string): Promise<boolean>;
    create(input: CreateSocioPersistenceInput): Promise<CreatedSocioRecord>;
}
