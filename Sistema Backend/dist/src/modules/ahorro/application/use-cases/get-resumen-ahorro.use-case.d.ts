import type { UseCase } from "../../../../shared/application/use-case.interface";
import { type CuentaRepositoryPort } from '../../domain/ports/cuenta.repository.port';
import { type AporteRepositoryPort } from '../../domain/ports/aporte.repository.port';
import { type MetaConfigRepositoryPort } from '../../domain/ports/meta-config.repository.port';
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
export declare class GetResumenAhorroUseCase implements UseCase<string, ResumenAhorroResult> {
    private readonly cuentas;
    private readonly aportes;
    private readonly metaConfig;
    constructor(cuentas: CuentaRepositoryPort, aportes: AporteRepositoryPort, metaConfig: MetaConfigRepositoryPort);
    execute(userId: string): Promise<ResumenAhorroResult>;
}
