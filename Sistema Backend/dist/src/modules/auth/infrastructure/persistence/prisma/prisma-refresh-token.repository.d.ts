import type { RefreshTokenRepositoryPort } from '../../../domain/ports/refresh-token.repository.port';
import { PrismaService } from "../../../../../shared/infrastructure/prisma/prisma.service";
export declare class PrismaRefreshTokenRepository implements RefreshTokenRepositoryPort {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(userId: string, tokenHash: string, expiresAt: Date): Promise<string>;
    revoke(id: string): Promise<void>;
    revokeAllForUser(userId: string): Promise<void>;
    findMatchForUser(userId: string, plainRefreshToken: string, compare: (plain: string, hash: string) => Promise<boolean>): Promise<{
        id: string;
    } | null>;
}
