export type EstadoSocio = 'activo' | 'inactivo' | 'pendiente';

export type EstadoCuentaAhorro = 'ACTIVA' | 'INACTIVA';

export interface CuentaAhorroSocio {
  id: string;
  numeroCuenta: string;
  correo?: string;
  codigoReferencia?: string | null;
  saldo: number;
  estado: EstadoCuentaAhorro;
  fechaApertura: string;
}

export interface Socio {
  id: string;
  codigoReferencia: string;
  nombres: string;
  cedula: string;
  email: string;
  telefono: string;
  estado: EstadoSocio;
  fechaAlta: string;
  /** Código del socio que refirió (ej. SOC-ABC123) */
  referidoPor?: string;
  referidoPorId?: string;
  cuentas: CuentaAhorroSocio[];
}

export interface CrearSocioInput {
  nombres: string;
  cedula: string;
  email: string;
  telefono: string;
  codigoReferenciaIngresado?: string;
}

export interface RegistroPublicoSocioInput {
  nombres: string;
  cedula: string;
  email: string;
  telefono: string;
  codigoReferenciaIngresado: string;
}

export interface ActualizarSocioInput {
  nombres: string;
  cedula: string;
  email: string;
  telefono: string;
}

export interface ValidacionCodigoReferencia {
  valido: boolean;
  socioReferidor?: Socio;
  error?: string;
}
