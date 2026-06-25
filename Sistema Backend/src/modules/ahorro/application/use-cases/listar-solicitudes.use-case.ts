import { Inject, Injectable } from '@nestjs/common';
import type { UseCase } from '@shared/application/use-case.interface';
import {
  SOLICITUD_CUENTA_REPOSITORY,
  type ListarSolicitudesFiltro,
  type SolicitudCuentaAdminItem,
  type SolicitudCuentaRepositoryPort,
} from '../../domain/ports/solicitud-cuenta.repository.port';

@Injectable()
export class ListarSolicitudesUseCase
  implements UseCase<ListarSolicitudesFiltro, SolicitudCuentaAdminItem[]>
{
  constructor(
    @Inject(SOLICITUD_CUENTA_REPOSITORY)
    private readonly solicitudes: SolicitudCuentaRepositoryPort,
  ) {}

  async execute(
    filtro: ListarSolicitudesFiltro,
  ): Promise<SolicitudCuentaAdminItem[]> {
    return this.solicitudes.listForAdmin(filtro);
  }
}
