import type { EstadoAporte } from '@prisma/client';
import type { PageSlice } from "../../../../shared/application/pagination";
export declare const APORTE_REPOSITORY: unique symbol;
export interface AporteResumen {
    idAporteMensual: string;
    cuentaId: string;
    mes: string;
    monto: number;
    metaMensual: number;
    referencia: string | null;
    comprobante: string;
    urlArchivo: string;
    archivoNombre: string | null;
    descripcion: string | null;
    estado: EstadoAporte;
    fechaRegistro: Date;
    createdAt: Date;
}
export type AporteListItem = Omit<AporteResumen, 'urlArchivo'>;
export interface AporteComprobante {
    idAporteMensual: string;
    cuentaId: string;
    comprobante: string;
    archivoNombre: string | null;
    urlArchivo: string;
}
export interface AporteAdminItem extends AporteListItem {
    numeroCuenta: string;
    cuentaNombre: string;
    socioId: string;
    socioCodigo: string;
    socioNombre: string;
}
export interface CrearAporteInput {
    cuentaId: string;
    mes: string;
    monto: number;
    metaMensual: number;
    referencia?: string | null;
    comprobante: string;
    urlArchivo: string;
    archivoNombre?: string | null;
    descripcion?: string | null;
}
export interface ListarAportesFiltro {
    estado?: EstadoAporte;
    mes?: string;
    cuentaId?: string;
    page: number;
    limit: number;
}
export interface ListarMisAportesFiltro {
    cuentaId?: string;
    desde?: Date;
    hasta?: Date;
    page: number;
    limit: number;
}
export interface AporteAgregadoCuenta {
    cuentaId: string;
    saldoPendiente: number;
    progresoMes: number;
}
export interface AporteRepositoryPort {
    existsByCuentaAndMes(cuentaId: string, mes: string): Promise<boolean>;
    existsByComprobante(comprobante: string): Promise<boolean>;
    create(input: CrearAporteInput): Promise<AporteResumen>;
    findById(aporteId: string): Promise<AporteResumen | null>;
    findComprobante(aporteId: string): Promise<AporteComprobante | null>;
    listByCuentaAndAnio(cuentaId: string, anio: number): Promise<AporteListItem[]>;
    listByUserId(userId: string, filtro: ListarMisAportesFiltro): Promise<PageSlice<AporteListItem>>;
    listAggregatesByUser(userId: string, mes: string): Promise<AporteAgregadoCuenta[]>;
    listForAdmin(filtro: ListarAportesFiltro): Promise<PageSlice<AporteAdminItem>>;
    cambiarEstado(aporteId: string, estado: EstadoAporte, observaciones?: string | null, verificadoPor?: string | null): Promise<AporteResumen>;
}
