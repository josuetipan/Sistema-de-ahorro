import * as bcrypt from 'bcrypt';
import type { User } from '../../domain/user.entity';
import type { AuthTokenPort } from '../../domain/ports/auth-token.port';
import type { RefreshTokenRepositoryPort } from '../../domain/ports/refresh-token.repository.port';
import type { AuthSessionDto } from './auth-session.dto';

const SALT_ROUNDS = 10;

function refreshExpiresAt(): Date {
  const days = Number(process.env.JWT_REFRESH_EXPIRES_DAYS ?? '7');
  const d = new Date();
  d.setDate(d.getDate() + (Number.isFinite(days) && days > 0 ? days : 7));
  return d;
}

export async function buildAuthSession(
  user: User,
  tokens: AuthTokenPort,
  refreshRepo: RefreshTokenRepositoryPort,
): Promise<AuthSessionDto> {
  const accessToken = await tokens.createAccessToken(user.id, user.roles);
  const refreshToken = await tokens.createRefreshToken(user.id);
  const tokenHash = await bcrypt.hash(refreshToken, SALT_ROUNDS);
  await refreshRepo.create(user.id, tokenHash, refreshExpiresAt());

  return {
    accessToken,
    refreshToken,
    expiresIn: tokens.getAccessExpiresInSeconds(),
    user: {
      id: user.id,
      usuario: user.usuario,
      identification: user.identification,
      email: user.email,
      fullName: user.fullName,
      cityId: user.cityId,
      cityName: user.cityName,
      roles: [...user.roles],
      isActive: user.isActive,
      pending_password_reset: user.pendingPasswordReset,
      maturityAt: user.maturityAt.toISOString(),
    },
  };
}
