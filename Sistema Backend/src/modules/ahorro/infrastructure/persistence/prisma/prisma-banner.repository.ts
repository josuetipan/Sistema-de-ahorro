import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';
import type {
  ActualizarBannerInput,
  BannerRepositoryPort,
  BannerResumen,
  CrearBannerInput,
} from '../../../domain/ports/banner.repository.port';

type BannerRow = Prisma.BannerGetPayload<Record<string, never>>;

function toResumen(row: BannerRow): BannerResumen {
  return {
    idBanner: row.id_banner,
    titulo: row.titulo,
    subtitulo: row.subtitulo,
    imagenUrl: row.imagen_url,
    orden: row.orden,
    activo: row.activo,
    createdAt: row.createdAt,
  };
}

@Injectable()
export class PrismaBannerRepository implements BannerRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async listActive(): Promise<BannerResumen[]> {
    const rows = await this.prisma.banner.findMany({
      where: { activo: true },
      orderBy: [{ orden: 'asc' }, { createdAt: 'asc' }],
    });
    return rows.map(toResumen);
  }

  async listAll(): Promise<BannerResumen[]> {
    const rows = await this.prisma.banner.findMany({
      orderBy: [{ orden: 'asc' }, { createdAt: 'asc' }],
    });
    return rows.map(toResumen);
  }

  async create(input: CrearBannerInput): Promise<BannerResumen> {
    const row = await this.prisma.banner.create({
      data: {
        titulo: input.titulo,
        subtitulo: input.subtitulo ?? null,
        imagen_url: input.imagenUrl,
        orden: input.orden ?? undefined,
        activo: input.activo ?? undefined,
      },
    });
    return toResumen(row);
  }

  async findById(bannerId: string): Promise<BannerResumen | null> {
    const row = await this.prisma.banner.findUnique({
      where: { id_banner: bannerId },
    });
    return row ? toResumen(row) : null;
  }

  async update(
    bannerId: string,
    input: ActualizarBannerInput,
  ): Promise<BannerResumen> {
    const data: Prisma.BannerUpdateInput = {};
    if (input.titulo !== undefined) {
      data.titulo = input.titulo;
    }
    if (input.subtitulo !== undefined) {
      data.subtitulo = input.subtitulo;
    }
    if (input.imagenUrl !== undefined) {
      data.imagen_url = input.imagenUrl;
    }
    if (input.orden !== undefined) {
      data.orden = input.orden;
    }
    if (input.activo !== undefined) {
      data.activo = input.activo;
    }
    const row = await this.prisma.banner.update({
      where: { id_banner: bannerId },
      data,
    });
    return toResumen(row);
  }

  async delete(bannerId: string): Promise<void> {
    await this.prisma.banner.delete({ where: { id_banner: bannerId } });
  }
}
