import type { UseCase } from "../../../../shared/application/use-case.interface";
import { type CuentaRepositoryPort } from '../../domain/ports/cuenta.repository.port';
import { type AporteRepositoryPort, type AporteResumen } from '../../domain/ports/aporte.repository.port';
import { type MetaConfigRepositoryPort } from '../../domain/ports/meta-config.repository.port';
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
export declare class RegistrarAporteUseCase implements UseCase<RegistrarAporteInput, AporteResumen> {
    private readonly cuentas;
    private readonly aportes;
    private readonly metaConfig;
    constructor(cuentas: CuentaRepositoryPort, aportes: AporteRepositoryPort, metaConfig: MetaConfigRepositoryPort);
    execute(input: RegistrarAporteInput): Promise<AporteResumen>;
}
