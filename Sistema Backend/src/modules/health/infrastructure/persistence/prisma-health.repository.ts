import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';
import type { HealthRepositoryPort } from '../../domain/ports/health.repository.port';

@Injectable()
export class PrismaHealthRepository implements HealthRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async pingDatabase(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }
}
