import { Inject, Injectable } from '@nestjs/common';
import type { UseCase } from '@shared/application/use-case.interface';
import { paginate, type PaginatedResult } from '@shared/application/pagination';
import {
  CUENTA_REPOSITORY,
  type CuentaRepositoryPort,
  type ListSociosCustomerParams,
  type SocioAhorroResumen,
} from '../../domain/ports/cuenta.repository.port';

export type ListarSociosAhorroInput = ListSociosCustomerParams;

@Injectable()
export class ListarSociosAhorroUseCase
  implements UseCase<ListarSociosAhorroInput, PaginatedResult<SocioAhorroResumen>>
{
  constructor(
    @Inject(CUENTA_REPOSITORY)
    private readonly cuentas: CuentaRepositoryPort,
  ) {}

  async execute(
    input: ListarSociosAhorroInput,
  ): Promise<PaginatedResult<SocioAhorroResumen>> {
    const { items, total } = await this.cuentas.listSociosCustomer({
      page: input.page,
      limit: input.limit,
      q: input.q,
      estado: input.estado,
      codigo: input.codigo,
      nombre: input.nombre,
      email: input.email,
      identification: input.identification,
      cuentaEstado: input.cuentaEstado,
    });
    return paginate(items, total, input.page, input.limit);
  }
}
