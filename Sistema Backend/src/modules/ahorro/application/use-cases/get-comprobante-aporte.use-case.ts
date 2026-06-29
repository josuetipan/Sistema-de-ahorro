import { Inject, Injectable } from '@nestjs/common';
import type { UseCase } from '@shared/application/use-case.interface';
import {
  AporteNotFoundError,
  CuentaForbiddenError,
} from '../../domain/ahorro.errors';
import {
  CUENTA_REPOSITORY,
  type CuentaRepositoryPort,
} from '../../domain/ports/cuenta.repository.port';
import {
  APORTE_REPOSITORY,
  type AporteComprobante,
  type AporteRepositoryPort,
} from '../../domain/ports/aporte.repository.port';

export interface GetComprobanteAporteInput {
  userId: string;
  aporteId: string;
}

@Injectable()
export class GetComprobanteAporteUseCase
  implements UseCase<GetComprobanteAporteInput, AporteComprobante>
{
  constructor(
    @Inject(APORTE_REPOSITORY)
    private readonly aportes: AporteRepositoryPort,
    @Inject(CUENTA_REPOSITORY)
    private readonly cuentas: CuentaRepositoryPort,
  ) {}

  async execute(input: GetComprobanteAporteInput): Promise<AporteComprobante> {
    const comprobante = await this.aportes.findComprobante(input.aporteId);
    if (!comprobante) {
      throw new AporteNotFoundError(input.aporteId);
    }
    const ownership = await this.cuentas.findOwnership(comprobante.cuentaId);
    if (!ownership || ownership.userId !== input.userId) {
      throw new CuentaForbiddenError();
    }
    return comprobante;
  }
}
