import { Injectable } from '@nestjs/common';
import type {
  CreateInvitacionPersistenceInput,
  CreatedInvitacionRecord,
  InvitacionRepositoryPort,
} from '../../../domain/ports/invitacion.repository.port';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';

@Injectable()
export class PrismaInvitacionRepository implements InvitacionRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async existsByCodigo(codigo: string): Promise<boolean> {
    const row = await this.prisma.invitacion.findUnique({
      where: { codigo },
      select: { id_invitacion: true },
    });
    return row !== null;
  }

  async create(
    input: CreateInvitacionPersistenceInput,
  ): Promise<CreatedInvitacionRecord> {
    const row = await this.prisma.invitacion.create({
      data: {
        user_id: input.userId,
        codigo: input.codigo,
        activo: true,
      },
    });
    return {
      idInvitacion: row.id_invitacion,
      codigo: row.codigo,
      activo: row.activo,
    };
  }
}
