/** Resumen de una cuenta de ahorro (item dentro del resumen global). */
export interface CuentaResumen {
  cuentaId: string;
  numeroCuenta: string;
  nombre: string;
  estado: string;
  saldo: number;
  saldoDisponible: number;
  saldoPendiente: number;
  /** Progreso del mes expresado como porcentaje (0-100). */
  progresoMes: number;
  metaMensual: number;
  metaCumplida: boolean;
}

/** Resumen global de ahorro del socio (respuesta de GET /ahorro/resumen). */
export interface ResumenAhorroGlobal {
  mesActual: string;
  metaMensual: number;
  metaMinima: number;
  metaMaxima: number;
  totalAhorradoGlobal: number;
  saldoDisponibleGlobal: number;
  saldoPendienteGlobal: number;
  progresoMesGlobal: number;
  cantidadCuentas: number;
  cuentas: CuentaResumen[];
}

/** Datos para crear una nueva cuenta de ahorro. */
export interface CrearCuentaInput {
  nombre: string;
  tipo: string;
  moneda: string;
  color: string;
  icono: string;
}

/** Aporte mensual de una cuenta de ahorro. */
export interface Aporte {
  id: string;
  cuentaId: string;
  mes: string;
  monto: number;
  estado: string;
  fechaRegistro: string;
  descripcion?: string;
  comprobante?: string;
}

/** Invitación del socio (GET /ahorro/mi-invitacion). */
export interface Invitacion {
  idInvitacion: string;
  codigo: string;
  activo: boolean;
  createdAt: string;
  titular: string;
  socioCodigo: string;
}

/** Mes dentro del calendario anual de ahorro. */
export interface MesCalendario {
  mes: string;
  numeroMes: number;
  metaMensual: number;
  metaMinima: number;
  metaMaxima: number;
  montoAportado: number;
  estado: string;
  cumplido: boolean;
  aporteId: string | null;
  comprobante: string | null;
}

/** Calendario anual de ahorro de una cuenta (GET /ahorro/cuentas/:id/calendario). */
export interface CalendarioAhorro {
  cuentaId: string;
  numeroCuenta: string;
  nombre: string;
  anio: number;
  totalAhorrado: number;
  mesesCumplidos: number;
  metaMensual: number;
  metaMinima: number;
  metaMaxima: number;
  meses: MesCalendario[];
}

/** Datos para registrar un aporte mensual (multipart). */
export interface RegistrarAporteInput {
  cuentaId: string;
  mes: string;
  monto: number;
  comprobante: string;
  archivo: File;
  referencia?: string;
  archivoNombre?: string;
  descripcion?: string;
}

export interface ListarAportesParams {
  cuentaId: string;
  limit?: number;
  page?: number;
  desde?: string;
  hasta?: string;
}

export interface AportesPage {
  data: Aporte[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/** Cuenta recién creada (body de POST /ahorro/cuentas). */
export interface CuentaCreada {
  idCuenta: string;
  numeroCuenta: string;
  nombre: string;
  tipo: string;
  estado: string;
  moneda: string;
  saldo: number;
  saldoDisponible: number;
  totalAhorrado: number;
  color: string;
  icono: string;
  fechaApertura: string;
  socioId: string;
  titular: string;
}

export type TipoSolicitudCuenta = 'retiro' | 'eliminacion';
export type EstadoSolicitudCuenta = 'pendiente' | 'aprobada' | 'rechazada';

export interface CrearSolicitudCuentaInput {
  tipo: TipoSolicitudCuenta;
  monto?: number;
  cuentaDestinoId?: string;
  motivo?: string;
}

export interface SolicitudCuenta {
  idSolicitudCuenta: string;
  cuentaOrigenId: string;
  cuentaDestinoId: string | null;
  tipo: TipoSolicitudCuenta;
  monto: number | null;
  motivo: string | null;
  estado: EstadoSolicitudCuenta;
  observaciones: string | null;
  resueltoPor: string | null;
  fechaResolucion: string | null;
  createdAt: string;
}
