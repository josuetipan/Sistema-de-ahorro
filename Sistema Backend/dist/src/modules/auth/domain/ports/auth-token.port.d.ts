export declare const AUTH_TOKEN_PORT: unique symbol;
export interface AuthTokenPort {
    createAccessToken(userId: string, roles: readonly string[]): Promise<string>;
    createRefreshToken(userId: string): Promise<string>;
    verifyRefreshToken(token: string): Promise<{
        userId: string;
    }>;
    getAccessExpiresInSeconds(): number;
}
