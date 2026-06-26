import type { UseCase } from "../../../../shared/application/use-case.interface";
import { type SolicitudCuentaRepositoryPort, type SolicitudCuentaResumen } from '../../domain/ports/solicitud-cuenta.repository.port';
export interface ResolverSolicitudInput {
    solicitudId: string;
    aprobar: boolean;
    observaciones?: string | null;
    resueltoPor: string;
}
export declare class ResolverSolicitudUseCase implements UseCase<ResolverSolicitudInput, SolicitudCuentaResumen> {
    private readonly solicitudes;
    constructor(solicitudes: SolicitudCuentaRepositoryPort);
    execute(input: ResolverSolicitudInput): Promise<SolicitudCuentaResumen>;
}
