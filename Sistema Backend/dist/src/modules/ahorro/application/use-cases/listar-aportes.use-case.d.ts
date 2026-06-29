import type { UseCase } from "../../../../shared/application/use-case.interface";
import { type PaginatedResult } from "../../../../shared/application/pagination";
import { type AporteAdminItem, type AporteRepositoryPort, type ListarAportesFiltro } from '../../domain/ports/aporte.repository.port';
export declare class ListarAportesUseCase implements UseCase<ListarAportesFiltro, PaginatedResult<AporteAdminItem>> {
    private readonly aportes;
    constructor(aportes: AporteRepositoryPort);
    execute(filtro: ListarAportesFiltro): Promise<PaginatedResult<AporteAdminItem>>;
}
