import type { PageSlice } from '@shared/application/pagination';
import type { EstadoCuenta, EstadoSocio } from '@prisma/client';

export const CUENTA_REPOSITORY = Symbol('CUENTA_REPOSITORY');

export interface CuentaResumen {
  idCuenta: string;
  numeroCuenta: string;
  nombre: string;
  tipo: string;
  estado: string;
  metaMensual: number;
  periodoMeses: number;
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
  metaMensual: number;
  periodoMeses: number;
}

export interface CrearCuentaInput {
  socioId: string;
  nombre: string;
  tipo?: string;
  moneda?: string;
  color?: string | null;
  icono?: string | null;
  metaMensual?: number;
  periodoMeses?: number;
}

export interface SocioAhorroResumen {
  idSocio: string | null;
  codigo: string | null;
  estado: string;
  userId: string;
  roleCode: string;
  roleName: string;
  fullName: string;
  email: string | null;
  identification: string | null;
  phoneNumber: string | null;
  totalAhorrado: number;
  cantidadCuentas: number;
  cuentas: CuentaResumen[];
}

export interface ListSociosCustomerParams {
  page: number;
  limit: number;
  q?: string;
  estado?: EstadoSocio;
  codigo?: string;
  nombre?: string;
  email?: string;
  identification?: string;
  roleCode?: string;
  cuentaEstado?: EstadoCuenta;
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
  listSociosCustomer(
    params: ListSociosCustomerParams,
  ): Promise<PageSlice<SocioAhorroResumen>>;
  getSocioCustomer(socioId: string): Promise<SocioAhorroResumen | null>;
}
