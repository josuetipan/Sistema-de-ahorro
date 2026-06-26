import type { EstadoSolicitudCuenta, TipoSolicitudCuenta } from '@prisma/client';
export declare const SOLICITUD_CUENTA_REPOSITORY: unique symbol;
export interface SolicitudCuentaResumen {
    idSolicitudCuenta: string;
    cuentaOrigenId: string;
    cuentaDestinoId: string | null;
    tipo: TipoSolicitudCuenta;
    monto: number | null;
    motivo: string | null;
    estado: EstadoSolicitudCuenta;
    observaciones: string | null;
    resueltoPor: string | null;
    fechaResolucion: Date | null;
    createdAt: Date;
}
export interface SolicitudCuentaAdminItem extends SolicitudCuentaResumen {
    numeroCuentaOrigen: string;
    socioId: string;
    socioNombre: string;
}
export interface CrearSolicitudInput {
    cuentaOrigenId: string;
    cuentaDestinoId?: string | null;
    tipo: TipoSolicitudCuenta;
    monto?: number | null;
    motivo?: string | null;
}
export interface ListarSolicitudesFiltro {
    estado?: EstadoSolicitudCuenta;
    tipo?: TipoSolicitudCuenta;
}
export interface SolicitudCuentaRepositoryPort {
    create(input: CrearSolicitudInput): Promise<SolicitudCuentaResumen>;
    findById(solicitudId: string): Promise<SolicitudCuentaResumen | null>;
    listForAdmin(filtro: ListarSolicitudesFiltro): Promise<SolicitudCuentaAdminItem[]>;
    listByUserId(userId: string): Promise<SolicitudCuentaResumen[]>;
    rechazar(solicitudId: string, resueltoPor: string, observaciones?: string | null): Promise<SolicitudCuentaResumen>;
    aprobar(solicitudId: string, resueltoPor: string, observaciones?: string | null): Promise<SolicitudCuentaResumen>;
}
