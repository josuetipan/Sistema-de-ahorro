import { Injectable } from '@nestjs/common';
import type { RefreshTokenRepositoryPort } from '../../../domain/ports/refresh-token.repository.port';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';

@Injectable()
export class PrismaRefreshTokenRepository implements RefreshTokenRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    tokenHash: string,
    expiresAt: Date,
  ): Promise<string> {
    const row = await this.prisma.passwordEncrypted.create({
      data: {
        id_usuario: userId,
        refresh: tokenHash,
        expires_at: expiresAt,
        revocado: false,
      },
    });
    return row.id_password_encrypted;
  }

  async revoke(id: string): Promise<void> {
    await this.prisma.passwordEncrypted.update({
      where: { id_password_encrypted: id },
      data: { revocado: true },
    });
  }

  async revokeAllForUser(userId: string): Promise<void> {
    await this.prisma.passwordEncrypted.updateMany({
      where: { id_usuario: userId, revocado: false },
      data: { revocado: true },
    });
  }

  async findMatchForUser(
    userId: string,
    plainRefreshToken: string,
    compare: (plain: string, hash: string) => Promise<boolean>,
  ): Promise<{ id: string } | null> {
    const rows = await this.prisma.passwordEncrypted.findMany({
      where: {
        id_usuario: userId,
        revocado: false,
        expires_at: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    for (const row of rows) {
      const match = await compare(plainRefreshToken, row.refresh);
      if (match) {
        return { id: row.id_password_encrypted };
      }
    }
    return null;
  }
}
