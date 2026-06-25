import type { UseCase } from "../../../../shared/application/use-case.interface";
import { type AporteAdminItem, type AporteRepositoryPort, type ListarAportesFiltro } from '../../domain/ports/aporte.repository.port';
export declare class ListarAportesUseCase implements UseCase<ListarAportesFiltro, AporteAdminItem[]> {
    private readonly aportes;
    constructor(aportes: AporteRepositoryPort);
    execute(filtro: ListarAportesFiltro): Promise<AporteAdminItem[]>;
}
