import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';
import type {
  ActualizarMetaConfigInput,
  MetaConfig,
  MetaConfigRepositoryPort,
} from '../../../domain/ports/meta-config.repository.port';

type ConfigRow = Prisma.ConfiguracionMetaAhorroGetPayload<
  Record<string, never>
>;

function toConfig(row: ConfigRow): MetaConfig {
  return {
    idConfiguracionMetaAhorro: row.id_configuracion_meta_ahorro,
    metaMensual: row.meta_mensual.toNumber(),
    metaMinima: row.meta_minima.toNumber(),
    metaMaxima: row.meta_maxima.toNumber(),
    updatedAt: row.updatedAt,
  };
}

@Injectable()
export class PrismaMetaConfigRepository implements MetaConfigRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async getOrCreate(): Promise<MetaConfig> {
    const existing = await this.prisma.configuracionMetaAhorro.findFirst({
      orderBy: { createdAt: 'asc' },
    });
    if (existing) {
      return toConfig(existing);
    }
    const created = await this.prisma.configuracionMetaAhorro.create({
      data: {},
    });
    return toConfig(created);
  }

  async actualizar(input: ActualizarMetaConfigInput): Promise<MetaConfig> {
    const current = await this.getOrCreate();
    const data: Prisma.ConfiguracionMetaAhorroUpdateInput = {};
    if (input.metaMensual !== undefined) {
      data.meta_mensual = input.metaMensual;
    }
    if (input.metaMinima !== undefined) {
      data.meta_minima = input.metaMinima;
    }
    if (input.metaMaxima !== undefined) {
      data.meta_maxima = input.metaMaxima;
    }
    const row = await this.prisma.configuracionMetaAhorro.update({
      where: {
        id_configuracion_meta_ahorro: current.idConfiguracionMetaAhorro,
      },
      data,
    });
    return toConfig(row);
  }
}
