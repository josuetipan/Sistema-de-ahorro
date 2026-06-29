import { Inject, Injectable } from '@nestjs/common';
import type { UseCase } from '@shared/application/use-case.interface';
import { paginate, type PaginatedResult } from '@shared/application/pagination';
import {
  CUENTA_REPOSITORY,
  type CuentaRepositoryPort,
  type SocioAhorroResumen,
} from '../../domain/ports/cuenta.repository.port';

export interface ListarSociosAhorroInput {
  page: number;
  limit: number;
}

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
    });
    return paginate(items, total, input.page, input.limit);
  }
}
