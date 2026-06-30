import { Inject, Injectable } from '@nestjs/common';
import type { UseCase } from '@shared/application/use-case.interface';
import { AporteNotFoundError } from '../../domain/ahorro.errors';
import {
  APORTE_REPOSITORY,
  type AporteComprobante,
  type AporteRepositoryPort,
} from '../../domain/ports/aporte.repository.port';

@Injectable()
export class GetComprobanteAporteAdminUseCase
  implements UseCase<string, AporteComprobante>
{
  constructor(
    @Inject(APORTE_REPOSITORY)
    private readonly aportes: AporteRepositoryPort,
  ) {}

  async execute(aporteId: string): Promise<AporteComprobante> {
    const comprobante = await this.aportes.findComprobante(aporteId);
    if (!comprobante) {
      throw new AporteNotFoundError(aporteId);
    }
    return comprobante;
  }
}
