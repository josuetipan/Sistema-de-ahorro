import type { UseCase } from "../../../../shared/application/use-case.interface";
import { type PaginatedResult } from "../../../../shared/application/pagination";
import { type CuentaRepositoryPort } from '../../domain/ports/cuenta.repository.port';
import { type AporteListItem, type AporteRepositoryPort } from '../../domain/ports/aporte.repository.port';
export interface ListarMisAportesInput {
    userId: string;
    cuentaId?: string;
    desde?: Date;
    hasta?: Date;
    page: number;
    limit: number;
}
export declare class ListarMisAportesUseCase implements UseCase<ListarMisAportesInput, PaginatedResult<AporteListItem>> {
    private readonly cuentas;
    private readonly aportes;
    constructor(cuentas: CuentaRepositoryPort, aportes: AporteRepositoryPort);
    execute(input: ListarMisAportesInput): Promise<PaginatedResult<AporteListItem>>;
}
