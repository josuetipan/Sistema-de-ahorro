import * as bcrypt from 'bcrypt';
import type { AuthTokenPort } from '../../domain/ports/auth-token.port';
import type { RefreshTokenRepositoryPort } from '../../domain/ports/refresh-token.repository.port';

export class LogoutUserUseCase {
  constructor(
    private readonly refreshRepo: RefreshTokenRepositoryPort,
    private readonly tokens: AuthTokenPort,
  ) {}

  async execute(refreshToken: string): Promise<void> {
    let userId: string;
    try {
      const payload = await this.tokens.verifyRefreshToken(refreshToken);
      userId = payload.userId;
    } catch {
      return;
    }

    const match = await this.refreshRepo.findMatchForUser(
      userId,
      refreshToken,
      (plain, hash) => bcrypt.compare(plain, hash),
    );
    if (match) {
      await this.refreshRepo.revoke(match.id);
    }
  }
}
