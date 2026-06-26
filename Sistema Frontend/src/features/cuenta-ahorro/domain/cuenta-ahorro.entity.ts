import type { EstadoCuentaAhorro } from '@features/socio/domain/socio.entity';

export type ModoCreacionCuenta = 'con_referencia' | 'sin_referencia';

/** Vista pública — nunca incluye usuario ni clave */
export interface CuentaAhorroPublica {
  id: string;
  socioId: string;
  socioNombre: string;
  numeroCuenta: string;
  correo: string;
  codigoReferencia: string | null;
  saldo: number;
  estado: EstadoCuentaAhorro;
  fechaApertura: string;
}

export interface EmailSimulado {
  id: string;
  cuentaId: string;
  to: string;
  subject: string;
  body: string;
  sentAt: string;
}

export interface CrearCuentaAhorroInput {
  modo: ModoCreacionCuenta;
  socioId?: string;
  nombres: string;
  cedula: string;
  correo: string;
  telefono: string;
  codigoReferenciaBusqueda?: string;
}

export interface ResultadoCreacionCuenta {
  cuenta: CuentaAhorroPublica;
  emailSimulado: EmailSimulado;
}

export interface SocioResumen {
  id: string;
  nombres: string;
  cedula: string;
  email: string;
  telefono: string;
  codigoReferencia: string;
  referidoPor?: string;
}
