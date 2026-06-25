import { Injectable } from '@nestjs/common';
import type {
  CreateSocioPersistenceInput,
  CreatedSocioRecord,
  SocioRepositoryPort,
} from '../../../domain/ports/socio.repository.port';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';

@Injectable()
export class PrismaSocioRepository implements SocioRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async existsByCodigo(codigo: string): Promise<boolean> {
    const row = await this.prisma.socio.findUnique({
      where: { codigo },
      select: { id_socio: true },
    });
    return row !== null;
  }

  async create(input: CreateSocioPersistenceInput): Promise<CreatedSocioRecord> {
    const row = await this.prisma.socio.create({
      data: {
        user_id: input.userId,
        codigo: input.codigo,
        estado: input.estado ?? 'pendiente',
      },
    });
    return {
      idSocio: row.id_socio,
      codigo: row.codigo,
      estado: row.estado,
    };
  }
}
