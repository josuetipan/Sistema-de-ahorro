/** Envoltura estándar de las respuestas del backend. */
export interface BackendEnvelope<T> {
  code: number;
  status: string;
  body: T;
}

export interface CuentaResumenDTO {
  cuentaId: string;
  numeroCuenta: string;
  nombre: string;
  estado: string;
  saldo: number;
  saldoDisponible: number;
  saldoPendiente: number;
  progresoMes: number;
  metaMensual: number;
  metaCumplida: boolean;
}

/** Respuesta de GET /ahorro/resumen (objeto directo, sin envoltura). */
export interface ResumenAhorroDTO {
  mesActual: string;
  metaMensual: number;
  metaMinima: number;
  metaMaxima: number;
  totalAhorradoGlobal: number;
  saldoDisponibleGlobal: number;
  saldoPendienteGlobal: number;
  progresoMesGlobal: number;
  cantidadCuentas: number;
  cuentas: CuentaResumenDTO[];
}

export interface AporteDTO {
  idAporteMensual: string;
  cuentaId: string;
  mes: string;
  monto: number;
  metaMensual: number;
  referencia: string;
  comprobante: string;
  urlArchivo: string;
  archivoNombre: string;
  descripcion: string;
  estado: string;
  fechaRegistro: string;
  createdAt: string;
}

export interface AportesResponseBody {
  data: AporteDTO[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface InvitacionDTO {
  idInvitacion: string;
  codigo: string;
  activo: boolean;
  createdAt: string;
  titular: string;
  socioCodigo: string;
}

export interface MesCalendarioDTO {
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

export interface CalendarioAhorroDTO {
  cuentaId: string;
  numeroCuenta: string;
  nombre: string;
  anio: number;
  totalAhorrado: number;
  mesesCumplidos: number;
  metaMensual: number;
  metaMinima: number;
  metaMaxima: number;
  meses: MesCalendarioDTO[];
}

export interface CrearCuentaRequest {
  nombre: string;
  tipo: string;
  moneda: string;
  color: string;
  icono: string;
}

/** Body de POST /ahorro/cuentas. */
export interface CuentaCreadaDTO {
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
  color: string;
  icono: string;
  fechaApertura: string;
  socioId: string;
  titular: string;
}
