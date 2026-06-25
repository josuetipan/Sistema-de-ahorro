import { JwtService } from '@nestjs/jwt';
import type { AuthTokenPort } from '../../domain/ports/auth-token.port';
export declare class JwtAuthTokenAdapter implements AuthTokenPort {
    private readonly jwt;
    private readonly accessSecret;
    private readonly refreshSecret;
    private readonly accessExpires;
    private readonly refreshExpires;
    constructor(jwt: JwtService);
    createAccessToken(userId: string, roles: readonly string[]): Promise<string>;
    createRefreshToken(userId: string): Promise<string>;
    verifyRefreshToken(token: string): Promise<{
        userId: string;
    }>;
    getAccessExpiresInSeconds(): number;
}
