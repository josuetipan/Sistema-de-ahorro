import type { UseCase } from "../../../../shared/application/use-case.interface";
import { type SolicitudCuentaRepositoryPort, type SolicitudCuentaResumen } from '../../domain/ports/solicitud-cuenta.repository.port';
export declare class ListarMisSolicitudesUseCase implements UseCase<string, SolicitudCuentaResumen[]> {
    private readonly solicitudes;
    constructor(solicitudes: SolicitudCuentaRepositoryPort);
    execute(userId: string): Promise<SolicitudCuentaResumen[]>;
}
