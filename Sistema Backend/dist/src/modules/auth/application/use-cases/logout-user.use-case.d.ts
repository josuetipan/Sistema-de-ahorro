import type { AuthTokenPort } from '../../domain/ports/auth-token.port';
import type { RefreshTokenRepositoryPort } from '../../domain/ports/refresh-token.repository.port';
export declare class LogoutUserUseCase {
    private readonly refreshRepo;
    private readonly tokens;
    constructor(refreshRepo: RefreshTokenRepositoryPort, tokens: AuthTokenPort);
    execute(refreshToken: string): Promise<void>;
}
