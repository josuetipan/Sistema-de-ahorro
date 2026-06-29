import { Inject, Injectable } from '@nestjs/common';
import type { UseCase } from '@shared/application/use-case.interface';
import { InvitacionNotFoundError } from '../../domain/ahorro.errors';
import {
  INVITACION_REPOSITORY,
  type InvitacionRepositoryPort,
  type InvitacionResumen,
} from '../../domain/ports/invitacion.repository.port';

@Injectable()
export class GetMiInvitacionUseCase
  implements UseCase<string, InvitacionResumen>
{
  constructor(
    @Inject(INVITACION_REPOSITORY)
    private readonly invitaciones: InvitacionRepositoryPort,
  ) {}

  async execute(userId: string): Promise<InvitacionResumen> {
    const invitacion = await this.invitaciones.findByUserId(userId);
    if (!invitacion) {
      throw new InvitacionNotFoundError();
    }
    return invitacion;
  }
}
