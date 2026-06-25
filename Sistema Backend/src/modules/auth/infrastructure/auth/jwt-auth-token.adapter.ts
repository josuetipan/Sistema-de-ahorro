import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { AuthTokenPort } from '../../domain/ports/auth-token.port';
import { getJwtAccessSecret } from './jwt-access-secret';

@Injectable()
export class JwtAuthTokenAdapter implements AuthTokenPort {
  private readonly accessSecret: string;
  private readonly refreshSecret: string;
  private readonly accessExpires: string;
  private readonly refreshExpires: string;

  constructor(private readonly jwt: JwtService) {
    this.accessSecret = getJwtAccessSecret();
    this.refreshSecret =
      process.env.JWT_REFRESH_SECRET?.trim() ||
      process.env.JWT_SECRET?.trim() ||
      'dev-refresh-secret-change-me';
    this.accessExpires =
      process.env.JWT_ACCESS_EXPIRES?.trim() ||
      process.env.JWT_EXPIRES_IN?.trim() ||
      '1d';
    this.refreshExpires = process.env.JWT_REFRESH_EXPIRES?.trim() || '7d';
  }

  async createAccessToken(
    userId: string,
    roles: readonly string[],
  ): Promise<string> {
    return this.jwt.signAsync(
      { sub: userId, roles: [...roles] },
      {
        secret: this.accessSecret,
        expiresIn: parseExpirationToSeconds(this.accessExpires),
      },
    );
  }

  async createRefreshToken(userId: string): Promise<string> {
    return this.jwt.signAsync(
      { sub: userId, type: 'refresh' },
      {
        secret: this.refreshSecret,
        expiresIn: parseExpirationToSeconds(this.refreshExpires),
      },
    );
  }

  async verifyRefreshToken(token: string): Promise<{ userId: string }> {
    try {
      const payload = await this.jwt.verifyAsync<{
        sub: string;
        type?: string;
      }>(token, { secret: this.refreshSecret });
      if (payload.type !== 'refresh' || !payload.sub) {
        throw new UnauthorizedException();
      }
      return { userId: payload.sub };
    } catch {
      throw new UnauthorizedException('Refresh token inválido');
    }
  }

  getAccessExpiresInSeconds(): number {
    return parseExpirationToSeconds(this.accessExpires);
  }
}

function parseExpirationToSeconds(expiration: string): number {
  const trimmed = expiration.trim();
  const match = /^(\d+)\s*([dhms])$/i.exec(trimmed);
  if (!match) {
    return 15 * 60;
  }
  const value = parseInt(match[1], 10);
  const unit = match[2].toLowerCase();

  switch (unit) {
    case 'd':
      return value * 24 * 60 * 60;
    case 'h':
      return value * 60 * 60;
    case 'm':
      return value * 60;
    case 's':
      return value;
    default:
      return 15 * 60;
  }
}
