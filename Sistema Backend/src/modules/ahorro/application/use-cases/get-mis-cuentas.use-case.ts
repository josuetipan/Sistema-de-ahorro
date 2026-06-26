import { Inject, Injectable } from '@nestjs/common';
import type { UseCase } from '@shared/application/use-case.interface';
import {
  CUENTA_REPOSITORY,
  type CuentaRepositoryPort,
  type CuentaResumen,
} from '../../domain/ports/cuenta.repository.port';

export interface MisCuentasResult {
  totalAhorradoGlobal: number;
  cantidadCuentas: number;
  cuentas: CuentaResumen[];
}

@Injectable()
export class GetMisCuentasUseCase implements UseCase<string, MisCuentasResult> {
  constructor(
    @Inject(CUENTA_REPOSITORY)
    private readonly cuentas: CuentaRepositoryPort,
  ) {}

  async execute(userId: string): Promise<MisCuentasResult> {
    const cuentas = await this.cuentas.listByUserId(userId);
    const totalAhorradoGlobal = cuentas.reduce((acc, c) => acc + c.saldo, 0);
    return {
      totalAhorradoGlobal,
      cantidadCuentas: cuentas.length,
      cuentas,
    };
  }
}
