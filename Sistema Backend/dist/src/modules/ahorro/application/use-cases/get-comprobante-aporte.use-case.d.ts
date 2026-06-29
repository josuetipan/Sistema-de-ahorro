import type { UseCase } from "../../../../shared/application/use-case.interface";
import { type CuentaRepositoryPort } from '../../domain/ports/cuenta.repository.port';
import { type AporteComprobante, type AporteRepositoryPort } from '../../domain/ports/aporte.repository.port';
export interface GetComprobanteAporteInput {
    userId: string;
    aporteId: string;
}
export declare class GetComprobanteAporteUseCase implements UseCase<GetComprobanteAporteInput, AporteComprobante> {
    private readonly aportes;
    private readonly cuentas;
    constructor(aportes: AporteRepositoryPort, cuentas: CuentaRepositoryPort);
    execute(input: GetComprobanteAporteInput): Promise<AporteComprobante>;
}
