import { Inject, Injectable } from '@nestjs/common';
import type { UseCase } from '@shared/application/use-case.interface';
import { SocioNotFoundError } from '../../domain/ahorro.errors';
import {
  CUENTA_REPOSITORY,
  type CrearCuentaInput,
  type CuentaRepositoryPort,
  type CuentaResumen,
} from '../../domain/ports/cuenta.repository.port';

@Injectable()
export class CrearCuentaUseCase
  implements UseCase<CrearCuentaInput, CuentaResumen>
{
  constructor(
    @Inject(CUENTA_REPOSITORY)
    private readonly cuentas: CuentaRepositoryPort,
  ) {}

  async execute(input: CrearCuentaInput): Promise<CuentaResumen> {
    const existe = await this.cuentas.socioExists(input.socioId);
    if (!existe) {
      throw new SocioNotFoundError();
    }
    return this.cuentas.create(input);
  }
}
