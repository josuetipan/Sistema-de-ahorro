import { Inject, Injectable } from '@nestjs/common';
import type { UseCase } from '@shared/application/use-case.interface';
import { paginate, type PaginatedResult } from '@shared/application/pagination';
import {
  SOLICITUD_CUENTA_REPOSITORY,
  type ListarSolicitudesFiltro,
  type SolicitudCuentaAdminItem,
  type SolicitudCuentaRepositoryPort,
} from '../../domain/ports/solicitud-cuenta.repository.port';

@Injectable()
export class ListarSolicitudesUseCase
  implements
    UseCase<ListarSolicitudesFiltro, PaginatedResult<SolicitudCuentaAdminItem>>
{
  constructor(
    @Inject(SOLICITUD_CUENTA_REPOSITORY)
    private readonly solicitudes: SolicitudCuentaRepositoryPort,
  ) {}

  async execute(
    filtro: ListarSolicitudesFiltro,
  ): Promise<PaginatedResult<SolicitudCuentaAdminItem>> {
    const { items, total } = await this.solicitudes.listForAdmin(filtro);
    return paginate(items, total, filtro.page, filtro.limit);
  }
}
