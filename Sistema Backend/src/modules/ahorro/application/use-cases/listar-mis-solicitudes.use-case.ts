import { Inject, Injectable } from '@nestjs/common';
import type { UseCase } from '@shared/application/use-case.interface';
import {
  SOLICITUD_CUENTA_REPOSITORY,
  type SolicitudCuentaRepositoryPort,
  type SolicitudCuentaResumen,
} from '../../domain/ports/solicitud-cuenta.repository.port';

@Injectable()
export class ListarMisSolicitudesUseCase
  implements UseCase<string, SolicitudCuentaResumen[]>
{
  constructor(
    @Inject(SOLICITUD_CUENTA_REPOSITORY)
    private readonly solicitudes: SolicitudCuentaRepositoryPort,
  ) {}

  async execute(userId: string): Promise<SolicitudCuentaResumen[]> {
    return this.solicitudes.listByUserId(userId);
  }
}
