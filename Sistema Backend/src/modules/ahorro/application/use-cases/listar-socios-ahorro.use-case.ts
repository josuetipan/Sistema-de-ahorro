import { Inject, Injectable } from '@nestjs/common';
import type { UseCase } from '@shared/application/use-case.interface';
import {
  CUENTA_REPOSITORY,
  type CuentaRepositoryPort,
  type SocioAhorroResumen,
} from '../../domain/ports/cuenta.repository.port';

@Injectable()
export class ListarSociosAhorroUseCase
  implements UseCase<void, SocioAhorroResumen[]>
{
  constructor(
    @Inject(CUENTA_REPOSITORY)
    private readonly cuentas: CuentaRepositoryPort,
  ) {}

  async execute(): Promise<SocioAhorroResumen[]> {
    return this.cuentas.listSociosCustomer();
  }
}
