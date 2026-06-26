import type { EstadoAporte } from '@prisma/client';

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

export interface AporteAdminItem extends AporteResumen {
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
}

export interface AporteRepositoryPort {
  existsByCuentaAndMes(cuentaId: string, mes: string): Promise<boolean>;
  existsByComprobante(comprobante: string): Promise<boolean>;
  create(input: CrearAporteInput): Promise<AporteResumen>;
  findById(aporteId: string): Promise<AporteResumen | null>;
  listByCuentaAndAnio(cuentaId: string, anio: number): Promise<AporteResumen[]>;
  listForAdmin(filtro: ListarAportesFiltro): Promise<AporteAdminItem[]>;
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
