import { Inject, Injectable } from '@nestjs/common';
import type { UseCase } from '@shared/application/use-case.interface';
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

export interface ResumenCuenta {
  cuentaId: string;
  numeroCuenta: string;
  nombre: string;
  estado: string;
  saldo: number;
  saldoDisponible: number;
  saldoPendiente: number;
  progresoMes: number;
  metaMensual: number;
  metaCumplida: boolean;
}

export interface ResumenAhorroResult {
  mesActual: string;
  metaMensual: number;
  metaMinima: number;
  metaMaxima: number;
  totalAhorradoGlobal: number;
  saldoDisponibleGlobal: number;
  saldoPendienteGlobal: number;
  progresoMesGlobal: number;
  cantidadCuentas: number;
  cuentas: ResumenCuenta[];
}

function mesActualKey(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

@Injectable()
export class GetResumenAhorroUseCase
  implements UseCase<string, ResumenAhorroResult>
{
  constructor(
    @Inject(CUENTA_REPOSITORY)
    private readonly cuentas: CuentaRepositoryPort,
    @Inject(APORTE_REPOSITORY)
    private readonly aportes: AporteRepositoryPort,
    @Inject(META_CONFIG_REPOSITORY)
    private readonly metaConfig: MetaConfigRepositoryPort,
  ) {}

  async execute(userId: string): Promise<ResumenAhorroResult> {
    const mesActual = mesActualKey();
    const [cuentas, agregados, meta] = await Promise.all([
      this.cuentas.listByUserId(userId),
      this.aportes.listAggregatesByUser(userId, mesActual),
      this.metaConfig.getOrCreate(),
    ]);

    const agregadoPorCuenta = new Map(
      agregados.map((a) => [a.cuentaId, a]),
    );

    const cuentasResumen: ResumenCuenta[] = cuentas.map((cuenta) => {
      const agregado = agregadoPorCuenta.get(cuenta.idCuenta);
      const saldoPendiente = agregado?.saldoPendiente ?? 0;
      const progresoMes = agregado?.progresoMes ?? 0;
      return {
        cuentaId: cuenta.idCuenta,
        numeroCuenta: cuenta.numeroCuenta,
        nombre: cuenta.nombre,
        estado: cuenta.estado,
        saldo: cuenta.saldo,
        saldoDisponible: cuenta.saldoDisponible,
        saldoPendiente,
        progresoMes,
        metaMensual: meta.metaMensual,
        metaCumplida: progresoMes >= meta.metaMensual && meta.metaMensual > 0,
      };
    });

    return {
      mesActual,
      metaMensual: meta.metaMensual,
      metaMinima: meta.metaMinima,
      metaMaxima: meta.metaMaxima,
      totalAhorradoGlobal: cuentasResumen.reduce((acc, c) => acc + c.saldo, 0),
      saldoDisponibleGlobal: cuentasResumen.reduce(
        (acc, c) => acc + c.saldoDisponible,
        0,
      ),
      saldoPendienteGlobal: cuentasResumen.reduce(
        (acc, c) => acc + c.saldoPendiente,
        0,
      ),
      progresoMesGlobal: cuentasResumen.reduce(
        (acc, c) => acc + c.progresoMes,
        0,
      ),
      cantidadCuentas: cuentasResumen.length,
      cuentas: cuentasResumen,
    };
  }
}
