import type { UseCase } from "../../../../shared/application/use-case.interface";
import { type ListarSolicitudesFiltro, type SolicitudCuentaAdminItem, type SolicitudCuentaRepositoryPort } from '../../domain/ports/solicitud-cuenta.repository.port';
export declare class ListarSolicitudesUseCase implements UseCase<ListarSolicitudesFiltro, SolicitudCuentaAdminItem[]> {
    private readonly solicitudes;
    constructor(solicitudes: SolicitudCuentaRepositoryPort);
    execute(filtro: ListarSolicitudesFiltro): Promise<SolicitudCuentaAdminItem[]>;
}
