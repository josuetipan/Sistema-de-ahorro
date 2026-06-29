import type { PageSlice } from '@shared/application/pagination';

export const CUENTA_REPOSITORY = Symbol('CUENTA_REPOSITORY');

export interface CuentaResumen {
  idCuenta: string;
  numeroCuenta: string;
  nombre: string;
  tipo: string;
  estado: string;
  moneda: string;
  saldo: number;
  saldoDisponible: number;
  totalAhorrado: number;
  totalDepositos: number;
  totalRetiros: number;
  color: string | null;
  icono: string | null;
  fechaApertura: Date;
}

export interface CuentaOwnership {
  idCuenta: string;
  socioId: string;
  userId: string;
  saldo: number;
  estado: string;
}

export interface CrearCuentaInput {
  socioId: string;
  nombre: string;
  tipo?: string;
  moneda?: string;
  color?: string | null;
  icono?: string | null;
}

export interface SocioAhorroResumen {
  idSocio: string;
  codigo: string;
  estado: string;
  userId: string;
  fullName: string;
  email: string | null;
  identification: string | null;
  phoneNumber: string | null;
  totalAhorrado: number;
  cantidadCuentas: number;
  cuentas: CuentaResumen[];
}

export interface CuentaRepositoryPort {
  socioExists(socioId: string): Promise<boolean>;
  create(input: CrearCuentaInput): Promise<CuentaResumen>;
  /** Cuentas del socio asociado al usuario autenticado. */
  listByUserId(userId: string): Promise<CuentaResumen[]>;
  /** Resuelve el id del socio a partir del usuario autenticado. */
  findSocioIdByUserId(userId: string): Promise<string | null>;
  /** Verifica que la cuenta pertenezca al usuario (para vista usuario). */
  findOwnership(cuentaId: string): Promise<CuentaOwnership | null>;
  findResumenById(cuentaId: string): Promise<CuentaResumen | null>;
  /** Admin: socios CUSTOMER con su total ahorrado y cuentas (paginado). */
  listSociosCustomer(params: {
    page: number;
    limit: number;
  }): Promise<PageSlice<SocioAhorroResumen>>;
  getSocioCustomer(socioId: string): Promise<SocioAhorroResumen | null>;
}
