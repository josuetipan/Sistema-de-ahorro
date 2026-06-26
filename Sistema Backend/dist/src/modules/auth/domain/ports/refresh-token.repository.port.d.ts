export declare const REFRESH_TOKEN_REPOSITORY: unique symbol;
export interface RefreshTokenRepositoryPort {
    create(userId: string, tokenHash: string, expiresAt: Date): Promise<string>;
    revoke(id: string): Promise<void>;
    revokeAllForUser(userId: string): Promise<void>;
    findMatchForUser(userId: string, plainRefreshToken: string, compare: (plain: string, hash: string) => Promise<boolean>): Promise<{
        id: string;
    } | null>;
}
