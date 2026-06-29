import { PrismaService } from "../../../../../shared/infrastructure/prisma/prisma.service";
import type { PageSlice } from "../../../../../shared/application/pagination";
import type { CrearSolicitudInput, ListarSolicitudesFiltro, SolicitudCuentaAdminItem, SolicitudCuentaRepositoryPort, SolicitudCuentaResumen } from '../../../domain/ports/solicitud-cuenta.repository.port';
export declare class PrismaSolicitudCuentaRepository implements SolicitudCuentaRepositoryPort {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(input: CrearSolicitudInput): Promise<SolicitudCuentaResumen>;
    findById(solicitudId: string): Promise<SolicitudCuentaResumen | null>;
    listForAdmin(filtro: ListarSolicitudesFiltro): Promise<PageSlice<SolicitudCuentaAdminItem>>;
    listByUserId(userId: string): Promise<SolicitudCuentaResumen[]>;
    rechazar(solicitudId: string, resueltoPor: string, observaciones?: string | null): Promise<SolicitudCuentaResumen>;
    aprobar(solicitudId: string, resueltoPor: string, observaciones?: string | null): Promise<SolicitudCuentaResumen>;
}
