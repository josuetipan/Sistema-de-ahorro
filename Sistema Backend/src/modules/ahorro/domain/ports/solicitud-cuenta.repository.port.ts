import type {
  EstadoSolicitudCuenta,
  TipoSolicitudCuenta,
} from '@prisma/client';
import type { PageSlice } from '@shared/application/pagination';

export const SOLICITUD_CUENTA_REPOSITORY = Symbol('SOLICITUD_CUENTA_REPOSITORY');

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
  page: number;
  limit: number;
}

export interface SolicitudCuentaRepositoryPort {
  create(input: CrearSolicitudInput): Promise<SolicitudCuentaResumen>;
  findById(solicitudId: string): Promise<SolicitudCuentaResumen | null>;
  listForAdmin(
    filtro: ListarSolicitudesFiltro,
  ): Promise<PageSlice<SolicitudCuentaAdminItem>>;
  listByUserId(userId: string): Promise<SolicitudCuentaResumen[]>;
  /** Rechaza la solicitud sin afectar saldos. */
  rechazar(
    solicitudId: string,
    resueltoPor: string,
    observaciones?: string | null,
  ): Promise<SolicitudCuentaResumen>;
  /**
   * Aprueba la solicitud aplicando el efecto correspondiente de forma atómica:
   * - retiro: descuenta de la cuenta origen y, si hay destino, lo transfiere.
   * - eliminacion: transfiere el saldo restante a la cuenta destino (si existe)
   *   y marca la cuenta origen como cerrada.
   */
  aprobar(
    solicitudId: string,
    resueltoPor: string,
    observaciones?: string | null,
  ): Promise<SolicitudCuentaResumen>;
}
