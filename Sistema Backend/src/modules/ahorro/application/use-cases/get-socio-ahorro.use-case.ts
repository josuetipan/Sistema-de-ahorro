import { Inject, Injectable } from '@nestjs/common';
import type { UseCase } from '@shared/application/use-case.interface';
import { SocioNotFoundError } from '../../domain/ahorro.errors';
import {
  CUENTA_REPOSITORY,
  type CuentaRepositoryPort,
  type SocioAhorroResumen,
} from '../../domain/ports/cuenta.repository.port';

@Injectable()
export class GetSocioAhorroUseCase
  implements UseCase<string, SocioAhorroResumen>
{
  constructor(
    @Inject(CUENTA_REPOSITORY)
    private readonly cuentas: CuentaRepositoryPort,
  ) {}

  async execute(socioId: string): Promise<SocioAhorroResumen> {
    const socio = await this.cuentas.getSocioCustomer(socioId);
    if (!socio) {
      throw new SocioNotFoundError();
    }
    return socio;
  }
}
