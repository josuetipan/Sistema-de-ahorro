import { Inject, Injectable } from '@nestjs/common';
import type { UseCase } from '@shared/application/use-case.interface';
import {
  APORTE_REPOSITORY,
  type AporteAdminItem,
  type AporteRepositoryPort,
  type ListarAportesFiltro,
} from '../../domain/ports/aporte.repository.port';

@Injectable()
export class ListarAportesUseCase
  implements UseCase<ListarAportesFiltro, AporteAdminItem[]>
{
  constructor(
    @Inject(APORTE_REPOSITORY)
    private readonly aportes: AporteRepositoryPort,
  ) {}

  async execute(filtro: ListarAportesFiltro): Promise<AporteAdminItem[]> {
    return this.aportes.listForAdmin(filtro);
  }
}
