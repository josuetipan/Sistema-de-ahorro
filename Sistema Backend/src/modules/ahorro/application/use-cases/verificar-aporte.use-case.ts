import { Inject, Injectable } from '@nestjs/common';
import type { EstadoAporte } from '@prisma/client';
import type { UseCase } from '@shared/application/use-case.interface';
import { AporteNotFoundError } from '../../domain/ahorro.errors';
import {
  APORTE_REPOSITORY,
  type AporteRepositoryPort,
  type AporteResumen,
} from '../../domain/ports/aporte.repository.port';

export interface VerificarAporteInput {
  aporteId: string;
  estado: EstadoAporte;
  observaciones?: string | null;
  verificadoPor: string;
}

@Injectable()
export class VerificarAporteUseCase
  implements UseCase<VerificarAporteInput, AporteResumen>
{
  constructor(
    @Inject(APORTE_REPOSITORY)
    private readonly aportes: AporteRepositoryPort,
  ) {}

  async execute(input: VerificarAporteInput): Promise<AporteResumen> {
    const aporte = await this.aportes.findById(input.aporteId);
    if (!aporte) {
      throw new AporteNotFoundError(input.aporteId);
    }
    return this.aportes.cambiarEstado(
      input.aporteId,
      input.estado,
      input.observaciones ?? null,
      input.verificadoPor,
    );
  }
}
