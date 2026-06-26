import type { EstadoAporte } from '@prisma/client';
import type { UseCase } from "../../../../shared/application/use-case.interface";
import { type CuentaRepositoryPort } from '../../domain/ports/cuenta.repository.port';
import { type AporteRepositoryPort } from '../../domain/ports/aporte.repository.port';
import { type MetaConfigRepositoryPort } from '../../domain/ports/meta-config.repository.port';
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
export declare class GetCalendarioCuentaUseCase implements UseCase<GetCalendarioInput, CalendarioResult> {
    private readonly cuentas;
    private readonly aportes;
    private readonly metaConfig;
    constructor(cuentas: CuentaRepositoryPort, aportes: AporteRepositoryPort, metaConfig: MetaConfigRepositoryPort);
    execute(input: GetCalendarioInput): Promise<CalendarioResult>;
}
