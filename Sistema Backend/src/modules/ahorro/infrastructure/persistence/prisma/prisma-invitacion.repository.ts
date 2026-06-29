import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';
import type {
  InvitacionRepositoryPort,
  InvitacionResumen,
} from '../../../domain/ports/invitacion.repository.port';

@Injectable()
export class PrismaInvitacionRepository implements InvitacionRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findByUserId(userId: string): Promise<InvitacionResumen | null> {
    const row = await this.prisma.invitacion.findUnique({
      where: { user_id: userId },
      include: {
        user: {
          select: {
            full_name: true,
            socio: { select: { codigo: true } },
          },
        },
      },
    });
    if (!row) {
      return null;
    }
    return {
      idInvitacion: row.id_invitacion,
      codigo: row.codigo,
      activo: row.activo,
      createdAt: row.createdAt,
      titular: row.user.full_name,
      socioCodigo: row.user.socio?.codigo ?? null,
    };
  }
}
