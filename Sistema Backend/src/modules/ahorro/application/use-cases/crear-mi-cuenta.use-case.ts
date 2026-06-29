import { Inject, Injectable } from '@nestjs/common';
import type { UseCase } from '@shared/application/use-case.interface';
import { SocioNotFoundError } from '../../domain/ahorro.errors';
import {
  CUENTA_REPOSITORY,
  type CuentaRepositoryPort,
  type CuentaResumen,
} from '../../domain/ports/cuenta.repository.port';

export interface CrearMiCuentaInput {
  userId: string;
  nombre: string;
  tipo?: string;
  moneda?: string;
  color?: string | null;
  icono?: string | null;
}

export interface CrearMiCuentaResult {
  socioId: string;
  cuenta: CuentaResumen;
}

@Injectable()
export class CrearMiCuentaUseCase
  implements UseCase<CrearMiCuentaInput, CrearMiCuentaResult>
{
  constructor(
    @Inject(CUENTA_REPOSITORY)
    private readonly cuentas: CuentaRepositoryPort,
  ) {}

  async execute(input: CrearMiCuentaInput): Promise<CrearMiCuentaResult> {
    const socioId = await this.cuentas.findSocioIdByUserId(input.userId);
    if (!socioId) {
      throw new SocioNotFoundError();
    }
    const cuenta = await this.cuentas.create({
      socioId,
      nombre: input.nombre,
      tipo: input.tipo,
      moneda: input.moneda,
      color: input.color ?? null,
      icono: input.icono ?? null,
    });
    return { socioId, cuenta };
  }
}
