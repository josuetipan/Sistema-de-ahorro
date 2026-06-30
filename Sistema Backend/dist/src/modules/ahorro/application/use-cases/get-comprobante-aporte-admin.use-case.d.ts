import type { UseCase } from "../../../../shared/application/use-case.interface";
import { type AporteComprobante, type AporteRepositoryPort } from '../../domain/ports/aporte.repository.port';
export declare class GetComprobanteAporteAdminUseCase implements UseCase<string, AporteComprobante> {
    private readonly aportes;
    constructor(aportes: AporteRepositoryPort);
    execute(aporteId: string): Promise<AporteComprobante>;
}
