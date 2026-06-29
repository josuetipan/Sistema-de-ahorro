import type { EstadoAporte } from '@prisma/client';
import type { PageSlice } from '@shared/application/pagination';

export const APORTE_REPOSITORY = Symbol('APORTE_REPOSITORY');

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

/**
 * Versión ligera para listados: omite `urlArchivo` (el comprobante en base64,
 * que puede pesar varios MB). El archivo se obtiene aparte con
 * {@link AporteRepositoryPort.findComprobante} cuando se necesita verlo.
 */
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
  /** Suma de montos en estado `pendiente`. */
  saldoPendiente: number;
  /** Suma de montos `verificado` del mes indicado. */
  progresoMes: number;
}

export interface AporteRepositoryPort {
  existsByCuentaAndMes(cuentaId: string, mes: string): Promise<boolean>;
  existsByComprobante(comprobante: string): Promise<boolean>;
  create(input: CrearAporteInput): Promise<AporteResumen>;
  findById(aporteId: string): Promise<AporteResumen | null>;
  /** Devuelve el comprobante (base64) de un aporte, o null si no existe. */
  findComprobante(aporteId: string): Promise<AporteComprobante | null>;
  listByCuentaAndAnio(cuentaId: string, anio: number): Promise<AporteListItem[]>;
  /** Aportes del socio asociado al usuario autenticado (paginado, con filtros). */
  listByUserId(
    userId: string,
    filtro: ListarMisAportesFiltro,
  ): Promise<PageSlice<AporteListItem>>;
  /** Sumas agregadas por cuenta para el resumen del socio (saldo pendiente, progreso del mes). */
  listAggregatesByUser(
    userId: string,
    mes: string,
  ): Promise<AporteAgregadoCuenta[]>;
  listForAdmin(filtro: ListarAportesFiltro): Promise<PageSlice<AporteAdminItem>>;
  /**
   * Cambia el estado del aporte. Si pasa a `verificado`, acredita el monto al
   * saldo de la cuenta (una sola vez); si sale de `verificado`, lo revierte.
   */
  cambiarEstado(
    aporteId: string,
    estado: EstadoAporte,
    observaciones?: string | null,
    verificadoPor?: string | null,
  ): Promise<AporteResumen>;
}
