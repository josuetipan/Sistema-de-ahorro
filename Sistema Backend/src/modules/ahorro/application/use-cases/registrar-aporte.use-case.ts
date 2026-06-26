import { Inject, Injectable } from '@nestjs/common';
import type { UseCase } from '@shared/application/use-case.interface';
import {
  AporteMesAlreadyExistsError,
  ComprobanteAlreadyTakenError,
  CuentaForbiddenError,
  CuentaNotFoundError,
} from '../../domain/ahorro.errors';
import {
  CUENTA_REPOSITORY,
  type CuentaRepositoryPort,
} from '../../domain/ports/cuenta.repository.port';
import {
  APORTE_REPOSITORY,
  type AporteRepositoryPort,
  type AporteResumen,
} from '../../domain/ports/aporte.repository.port';
import {
  META_CONFIG_REPOSITORY,
  type MetaConfigRepositoryPort,
} from '../../domain/ports/meta-config.repository.port';

export interface RegistrarAporteInput {
  userId: string;
  cuentaId: string;
  mes: string;
  monto: number;
  comprobante: string;
  urlArchivo: string;
  referencia?: string | null;
  archivoNombre?: string | null;
  descripcion?: string | null;
}

@Injectable()
export class RegistrarAporteUseCase
  implements UseCase<RegistrarAporteInput, AporteResumen>
{
  constructor(
    @Inject(CUENTA_REPOSITORY)
    private readonly cuentas: CuentaRepositoryPort,
    @Inject(APORTE_REPOSITORY)
    private readonly aportes: AporteRepositoryPort,
    @Inject(META_CONFIG_REPOSITORY)
    private readonly metaConfig: MetaConfigRepositoryPort,
  ) {}

  async execute(input: RegistrarAporteInput): Promise<AporteResumen> {
    const ownership = await this.cuentas.findOwnership(input.cuentaId);
    if (!ownership) {
      throw new CuentaNotFoundError(input.cuentaId);
    }
    if (ownership.userId !== input.userId) {
      throw new CuentaForbiddenError();
    }

    const yaExiste = await this.aportes.existsByCuentaAndMes(
      input.cuentaId,
      input.mes,
    );
    if (yaExiste) {
      throw new AporteMesAlreadyExistsError(input.mes);
    }

    const comprobanteUsado = await this.aportes.existsByComprobante(
      input.comprobante,
    );
    if (comprobanteUsado) {
      throw new ComprobanteAlreadyTakenError();
    }

    const meta = await this.metaConfig.getOrCreate();

    return this.aportes.create({
      cuentaId: input.cuentaId,
      mes: input.mes,
      monto: input.monto,
      metaMensual: meta.metaMensual,
      referencia: input.referencia ?? null,
      comprobante: input.comprobante,
      urlArchivo: input.urlArchivo,
      archivoNombre: input.archivoNombre ?? null,
      descripcion: input.descripcion ?? null,
    });
  }
}
