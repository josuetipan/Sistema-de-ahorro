import { Injectable } from '@nestjs/common';
import type {
  CityRepositoryPort,
  CitySummary,
} from '../../../domain/ports/city.repository.port';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';

@Injectable()
export class PrismaCityRepository implements CityRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findActiveById(id: string): Promise<CitySummary | null> {
    const row = await this.prisma.city.findUnique({
      where: { id_city: id },
      select: { id_city: true, name: true, is_active: true },
    });
    if (!row?.is_active) {
      return null;
    }
    return { id: row.id_city, name: row.name };
  }

  async findActiveByName(name: string): Promise<CitySummary | null> {
    const row = await this.prisma.city.findFirst({
      where: { name, is_active: true },
      select: { id_city: true, name: true },
    });
    if (!row) {
      return null;
    }
    return { id: row.id_city, name: row.name };
  }

  async ensureActiveByName(name: string): Promise<CitySummary> {
    const row = await this.prisma.city.upsert({
      where: { name },
      create: { name, is_active: true },
      update: { is_active: true },
      select: { id_city: true, name: true },
    });
    return { id: row.id_city, name: row.name };
  }
}
