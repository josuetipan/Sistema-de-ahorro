import { Inject, Injectable } from '@nestjs/common';
import type { UseCase } from '@shared/application/use-case.interface';
import {
  SolicitudCuentaNotFoundError,
  SolicitudYaResueltaError,
} from '../../domain/ahorro.errors';
import {
  SOLICITUD_CUENTA_REPOSITORY,
  type SolicitudCuentaRepositoryPort,
  type SolicitudCuentaResumen,
} from '../../domain/ports/solicitud-cuenta.repository.port';

export interface ResolverSolicitudInput {
  solicitudId: string;
  aprobar: boolean;
  observaciones?: string | null;
  resueltoPor: string;
}

@Injectable()
export class ResolverSolicitudUseCase
  implements UseCase<ResolverSolicitudInput, SolicitudCuentaResumen>
{
  constructor(
    @Inject(SOLICITUD_CUENTA_REPOSITORY)
    private readonly solicitudes: SolicitudCuentaRepositoryPort,
  ) {}

  async execute(
    input: ResolverSolicitudInput,
  ): Promise<SolicitudCuentaResumen> {
    const solicitud = await this.solicitudes.findById(input.solicitudId);
    if (!solicitud) {
      throw new SolicitudCuentaNotFoundError(input.solicitudId);
    }
    if (solicitud.estado !== 'pendiente') {
      throw new SolicitudYaResueltaError();
    }
    if (input.aprobar) {
      return this.solicitudes.aprobar(
        input.solicitudId,
        input.resueltoPor,
        input.observaciones ?? null,
      );
    }
    return this.solicitudes.rechazar(
      input.solicitudId,
      input.resueltoPor,
      input.observaciones ?? null,
    );
  }
}
