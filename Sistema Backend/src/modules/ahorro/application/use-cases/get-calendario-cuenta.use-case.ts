import { Inject, Injectable } from '@nestjs/common';
import type { EstadoAporte } from '@prisma/client';
import type { UseCase } from '@shared/application/use-case.interface';
import {
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
} from '../../domain/ports/aporte.repository.port';
import {
  META_CONFIG_REPOSITORY,
  type MetaConfigRepositoryPort,
} from '../../domain/ports/meta-config.repository.port';

export interface GetCalendarioInput {
  userId: string;
  cuentaId: string;
  anio: number;
}

export interface CalendarioMes {
  mes: string;
  numeroMes: number;
  metaMensual: number;
  metaMinima: number;
  metaMaxima: number;
  montoAportado: number;
  estado: EstadoAporte | 'sin_registro';
  cumplido: boolean;
  aporteId: string | null;
  comprobante: string | null;
}

export interface CalendarioResult {
  cuentaId: string;
  numeroCuenta: string;
  nombre: string;
  anio: number;
  totalAhorrado: number;
  mesesCumplidos: number;
  metaMensual: number;
  metaMinima: number;
  metaMaxima: number;
  meses: CalendarioMes[];
}

@Injectable()
export class GetCalendarioCuentaUseCase
  implements UseCase<GetCalendarioInput, CalendarioResult>
{
  constructor(
    @Inject(CUENTA_REPOSITORY)
    private readonly cuentas: CuentaRepositoryPort,
    @Inject(APORTE_REPOSITORY)
    private readonly aportes: AporteRepositoryPort,
    @Inject(META_CONFIG_REPOSITORY)
    private readonly metaConfig: MetaConfigRepositoryPort,
  ) {}

  async execute(input: GetCalendarioInput): Promise<CalendarioResult> {
    const ownership = await this.cuentas.findOwnership(input.cuentaId);
    if (!ownership) {
      throw new CuentaNotFoundError(input.cuentaId);
    }
    if (ownership.userId !== input.userId) {
      throw new CuentaForbiddenError();
    }

    const cuenta = await this.cuentas.findResumenById(input.cuentaId);
    if (!cuenta) {
      throw new CuentaNotFoundError(input.cuentaId);
    }

    const meta = await this.metaConfig.getOrCreate();

    const aportes = await this.aportes.listByCuentaAndAnio(
      input.cuentaId,
      input.anio,
    );
    const porMes = new Map(aportes.map((a) => [a.mes, a]));

    const meses: CalendarioMes[] = [];
    let mesesCumplidos = 0;
    for (let m = 1; m <= 12; m += 1) {
      const mesKey = `${input.anio}-${String(m).padStart(2, '0')}`;
      const aporte = porMes.get(mesKey);
      const cumplido = aporte?.estado === 'verificado';
      if (cumplido) {
        mesesCumplidos += 1;
      }
      meses.push({
        mes: mesKey,
        numeroMes: m,
        // La meta vigente es global; en meses con aporte se conserva el
        // snapshot histórico que se guardó al registrarlo.
        metaMensual: aporte?.metaMensual ?? meta.metaMensual,
        metaMinima: meta.metaMinima,
        metaMaxima: meta.metaMaxima,
        montoAportado: aporte?.monto ?? 0,
        estado: aporte?.estado ?? 'sin_registro',
        cumplido,
        aporteId: aporte?.idAporteMensual ?? null,
        comprobante: aporte?.comprobante ?? null,
      });
    }

    return {
      cuentaId: cuenta.idCuenta,
      numeroCuenta: cuenta.numeroCuenta,
      nombre: cuenta.nombre,
      anio: input.anio,
      totalAhorrado: cuenta.saldo,
      mesesCumplidos,
      metaMensual: meta.metaMensual,
      metaMinima: meta.metaMinima,
      metaMaxima: meta.metaMaxima,
      meses,
    };
  }
}
