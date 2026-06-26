import * as bcrypt from 'bcrypt';
import { InvalidRefreshTokenError } from '../../domain/invalid-refresh-token.error';
import type { UserRepositoryPort } from '../../domain/ports/user.repository.port';
import type { RefreshTokenRepositoryPort } from '../../domain/ports/refresh-token.repository.port';
import type { AuthTokenPort } from '../../domain/ports/auth-token.port';
import { isMaturityExpired } from '../../domain/maturity.util';
import { buildAuthSession } from './build-auth-session';
import type { AuthSessionDto } from './auth-session.dto';

export class RefreshSessionUseCase {
  constructor(
    private readonly users: UserRepositoryPort,
    private readonly refreshRepo: RefreshTokenRepositoryPort,
    private readonly tokens: AuthTokenPort,
  ) {}

  async execute(refreshToken: string): Promise<AuthSessionDto> {
    let payload: { userId: string };
    try {
      payload = await this.tokens.verifyRefreshToken(refreshToken);
    } catch {
      throw new InvalidRefreshTokenError();
    }

    const match = await this.refreshRepo.findMatchForUser(
      payload.userId,
      refreshToken,
      (plain, hash) => bcrypt.compare(plain, hash),
    );
    if (!match) {
      throw new InvalidRefreshTokenError();
    }

    await this.refreshRepo.revoke(match.id);

    const user = await this.users.findById(payload.userId);
    if (!user || !user.isActive) {
      throw new InvalidRefreshTokenError();
    }
    if (isMaturityExpired(user.maturityAt)) {
      throw new InvalidRefreshTokenError();
    }

    return buildAuthSession(user, this.tokens, this.refreshRepo);
  }
}
