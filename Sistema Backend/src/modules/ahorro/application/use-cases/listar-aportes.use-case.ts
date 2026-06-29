import { Inject, Injectable } from '@nestjs/common';
import type { UseCase } from '@shared/application/use-case.interface';
import { paginate, type PaginatedResult } from '@shared/application/pagination';
import {
  APORTE_REPOSITORY,
  type AporteAdminItem,
  type AporteRepositoryPort,
  type ListarAportesFiltro,
} from '../../domain/ports/aporte.repository.port';

@Injectable()
export class ListarAportesUseCase
  implements UseCase<ListarAportesFiltro, PaginatedResult<AporteAdminItem>>
{
  constructor(
    @Inject(APORTE_REPOSITORY)
    private readonly aportes: AporteRepositoryPort,
  ) {}

  async execute(
    filtro: ListarAportesFiltro,
  ): Promise<PaginatedResult<AporteAdminItem>> {
    const { items, total } = await this.aportes.listForAdmin(filtro);
    return paginate(items, total, filtro.page, filtro.limit);
  }
}
