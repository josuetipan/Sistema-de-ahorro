import type { UserRepositoryPort } from '../../domain/ports/user.repository.port';
import type { RefreshTokenRepositoryPort } from '../../domain/ports/refresh-token.repository.port';
import type { AuthTokenPort } from '../../domain/ports/auth-token.port';
import type { AuthSessionDto } from './auth-session.dto';
export interface LoginUserInput {
    usuario: string;
    password: string;
}
export declare class LoginUserUseCase {
    private readonly users;
    private readonly refreshRepo;
    private readonly tokens;
    constructor(users: UserRepositoryPort, refreshRepo: RefreshTokenRepositoryPort, tokens: AuthTokenPort);
    execute(input: LoginUserInput): Promise<AuthSessionDto>;
}
