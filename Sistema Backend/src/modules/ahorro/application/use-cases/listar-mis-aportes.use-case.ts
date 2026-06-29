import { Inject, Injectable } from '@nestjs/common';
import type { UseCase } from '@shared/application/use-case.interface';
import { paginate, type PaginatedResult } from '@shared/application/pagination';
import { CuentaForbiddenError } from '../../domain/ahorro.errors';
import {
  CUENTA_REPOSITORY,
  type CuentaRepositoryPort,
} from '../../domain/ports/cuenta.repository.port';
import {
  APORTE_REPOSITORY,
  type AporteListItem,
  type AporteRepositoryPort,
} from '../../domain/ports/aporte.repository.port';

export interface ListarMisAportesInput {
  userId: string;
  cuentaId?: string;
  desde?: Date;
  hasta?: Date;
  page: number;
  limit: number;
}

@Injectable()
export class ListarMisAportesUseCase
  implements UseCase<ListarMisAportesInput, PaginatedResult<AporteListItem>>
{
  constructor(
    @Inject(CUENTA_REPOSITORY)
    private readonly cuentas: CuentaRepositoryPort,
    @Inject(APORTE_REPOSITORY)
    private readonly aportes: AporteRepositoryPort,
  ) {}

  async execute(
    input: ListarMisAportesInput,
  ): Promise<PaginatedResult<AporteListItem>> {
    // Si se filtra por una cuenta concreta, validar que sea del usuario.
    if (input.cuentaId) {
      const ownership = await this.cuentas.findOwnership(input.cuentaId);
      if (!ownership || ownership.userId !== input.userId) {
        throw new CuentaForbiddenError();
      }
    }

    const { items, total } = await this.aportes.listByUserId(input.userId, {
      cuentaId: input.cuentaId,
      desde: input.desde,
      hasta: input.hasta,
      page: input.page,
      limit: input.limit,
    });
    return paginate(items, total, input.page, input.limit);
  }
}
