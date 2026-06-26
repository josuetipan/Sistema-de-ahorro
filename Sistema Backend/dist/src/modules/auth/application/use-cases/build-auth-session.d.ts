import type { User } from '../../domain/user.entity';
import type { AuthTokenPort } from '../../domain/ports/auth-token.port';
import type { RefreshTokenRepositoryPort } from '../../domain/ports/refresh-token.repository.port';
import type { AuthSessionDto } from './auth-session.dto';
export declare function buildAuthSession(user: User, tokens: AuthTokenPort, refreshRepo: RefreshTokenRepositoryPort): Promise<AuthSessionDto>;
