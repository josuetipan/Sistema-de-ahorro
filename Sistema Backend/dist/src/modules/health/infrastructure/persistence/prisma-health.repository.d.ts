import { PrismaService } from "../../../../shared/infrastructure/prisma/prisma.service";
import type { HealthRepositoryPort } from '../../domain/ports/health.repository.port';
export declare class PrismaHealthRepository implements HealthRepositoryPort {
    private readonly prisma;
    constructor(prisma: PrismaService);
    pingDatabase(): Promise<boolean>;
}
