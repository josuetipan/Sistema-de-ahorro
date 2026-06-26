// Datos demo para desarrollo frontend sin backend

export type EstadoCuenta = 'activa' | 'bloqueada' | 'inactiva';
export type TipoMovimiento = 'deposito' | 'retiro' | 'transferencia';
export type EstadoCredito = 'aprobado' | 'rechazado' | 'pendiente' | 'activo' | 'pagado' | 'vencido';
export type EstadoPago = 'aprobado' | 'pendiente' | 'rechazado';
export type EstadoVerificacion = 'verificado' | 'pendiente' | 'rechazado';

export interface CuentaAhorro {
  numeroCuenta: string;
  saldo: number;
  saldoDisponible: number;
  estado: EstadoCuenta;
  totalDepositos: number;
  totalRetiros: number;
}

export interface Movimiento {
  id: string;
  fecha: string;
  tipo: TipoMovimiento;
  monto: number;
  descripcion: string;
  comprobante: string;
}

export interface SolicitudCredito {
  id: string;
  monto: number;
  plazoMeses: number;
  tipo: string;
  estado: EstadoCredito;
  fecha: string;
}

export interface Credito {
  id: string;
  monto: number;
  plazoMeses: number;
  tipo: string;
  estado: EstadoCredito;
  cuotaMensual: number;
  cuotasPagadas: number;
  cuotasPendientes: number;
  proximoVencimiento: string;
  tasaAnual: number;
}

export interface CuotaAmortizacion {
  numero: number;
  fecha: string;
  capital: number;
  interes: number;
  total: number;
  estado: 'pagada' | 'pendiente' | 'vencida';
}

export interface Pago {
  id: string;
  creditoId: string;
  fecha: string;
  monto: number;
  cuotaNumero: number;
  estado: EstadoPago;
  comprobante: string;
}

export interface HistorialItem {
  id: string;
  categoria: 'ahorro' | 'credito' | 'pago' | 'solicitud';
  fecha: string;
  descripcion: string;
  monto?: number;
  estado: string;
}

export const MOCK_CUENTA: CuentaAhorro = {
  numeroCuenta: 'AH-2026-004821',
  saldo: 12500,
  saldoDisponible: 8300,
  estado: 'activa',
  totalDepositos: 18500,
  totalRetiros: 6000,
};

export const MOCK_MOVIMIENTOS: Movimiento[] = [
  {
    id: 'm1',
    fecha: '2026-05-20T10:30:00',
    tipo: 'deposito',
    monto: 2500,
    descripcion: 'Depósito en ventanilla',
    comprobante: 'DEP-2026-00142',
  },
  {
    id: 'm2',
    fecha: '2026-05-18T14:15:00',
    tipo: 'retiro',
    monto: 800,
    descripcion: 'Retiro ATM',
    comprobante: 'RET-2026-00089',
  },
  {
    id: 'm3',
    fecha: '2026-05-15T09:00:00',
    tipo: 'transferencia',
    monto: 1200,
    descripcion: 'Transferencia a cuenta interna',
    comprobante: 'TRF-2026-00056',
  },
  {
    id: 'm4',
    fecha: '2026-05-10T16:45:00',
    tipo: 'deposito',
    monto: 3000,
    descripcion: 'Depósito referenciado',
    comprobante: 'DEP-2026-00128',
  },
  {
    id: 'm5',
    fecha: '2026-05-05T11:20:00',
    tipo: 'retiro',
    monto: 500,
    descripcion: 'Retiro en sucursal',
    comprobante: 'RET-2026-00071',
  },
];

export const MOCK_SOLICITUDES: SolicitudCredito[] = [
  {
    id: 's1',
    monto: 15000,
    plazoMeses: 12,
    tipo: 'Personal',
    estado: 'pendiente',
    fecha: '2026-05-22T08:00:00',
  },
  {
    id: 's2',
    monto: 8000,
    plazoMeses: 6,
    tipo: 'Consumo',
    estado: 'aprobado',
    fecha: '2026-04-10T10:00:00',
  },
  {
    id: 's3',
    monto: 20000,
    plazoMeses: 24,
    tipo: 'Negocio',
    estado: 'rechazado',
    fecha: '2026-03-05T12:00:00',
  },
];

export const MOCK_CREDITOS: Credito[] = [
  {
    id: 'c1',
    monto: 8000,
    plazoMeses: 6,
    tipo: 'Consumo',
    estado: 'activo',
    cuotaMensual: 1450,
    cuotasPagadas: 2,
    cuotasPendientes: 4,
    proximoVencimiento: '2026-06-15',
    tasaAnual: 0.18,
  },
  {
    id: 'c2',
    monto: 12000,
    plazoMeses: 12,
    tipo: 'Personal',
    estado: 'activo',
    cuotaMensual: 1180,
    cuotasPagadas: 5,
    cuotasPendientes: 7,
    proximoVencimiento: '2026-06-20',
    tasaAnual: 0.16,
  },
  {
    id: 'c3',
    monto: 5000,
    plazoMeses: 3,
    tipo: 'Consumo',
    estado: 'pagado',
    cuotaMensual: 1750,
    cuotasPagadas: 3,
    cuotasPendientes: 0,
    proximoVencimiento: '2026-02-01',
    tasaAnual: 0.15,
  },
];

export const MOCK_PAGOS: Pago[] = [
  {
    id: 'p1',
    creditoId: 'c1',
    fecha: '2026-05-15T10:00:00',
    monto: 1450,
    cuotaNumero: 2,
    estado: 'aprobado',
    comprobante: 'PAG-2026-00301',
  },
  {
    id: 'p2',
    creditoId: 'c2',
    fecha: '2026-05-18T11:30:00',
    monto: 1180,
    cuotaNumero: 5,
    estado: 'aprobado',
    comprobante: 'PAG-2026-00315',
  },
  {
    id: 'p3',
    creditoId: 'c1',
    fecha: '2026-05-24T09:00:00',
    monto: 1450,
    cuotaNumero: 3,
    estado: 'pendiente',
    comprobante: 'PAG-2026-00328',
  },
];

export const MOCK_HISTORIAL: HistorialItem[] = [
  {
    id: 'h1',
    categoria: 'ahorro',
    fecha: '2026-05-20T10:30:00',
    descripcion: 'Depósito en ventanilla',
    monto: 2500,
    estado: 'completado',
  },
  {
    id: 'h2',
    categoria: 'pago',
    fecha: '2026-05-18T11:30:00',
    descripcion: 'Pago cuota crédito personal',
    monto: 1180,
    estado: 'aprobado',
  },
  {
    id: 'h3',
    categoria: 'solicitud',
    fecha: '2026-05-22T08:00:00',
    descripcion: 'Solicitud crédito personal $15,000',
    monto: 15000,
    estado: 'pendiente',
  },
  {
    id: 'h4',
    categoria: 'credito',
    fecha: '2026-04-10T10:00:00',
    descripcion: 'Crédito consumo aprobado',
    monto: 8000,
    estado: 'aprobado',
  },
  {
    id: 'h5',
    categoria: 'ahorro',
    fecha: '2026-05-18T14:15:00',
    descripcion: 'Retiro ATM',
    monto: 800,
    estado: 'completado',
  },
];

export function buildAmortizacion(credito: Credito): CuotaAmortizacion[] {
  const cuotas: CuotaAmortizacion[] = [];
  const r = credito.tasaAnual / 12;
  let saldo = credito.monto;
  const cuota =
    r === 0
      ? credito.monto / credito.plazoMeses
      : (credito.monto * r * Math.pow(1 + r, credito.plazoMeses)) /
        (Math.pow(1 + r, credito.plazoMeses) - 1);

  for (let i = 1; i <= credito.plazoMeses; i++) {
    const interes = saldo * r;
    const capital = cuota - interes;
    saldo -= capital;
    const fecha = new Date(2026, 0 + i, 15);
    let estado: CuotaAmortizacion['estado'] = 'pendiente';
    if (i <= credito.cuotasPagadas) estado = 'pagada';
    else if (i === credito.cuotasPagadas + 1) estado = 'pendiente';

    cuotas.push({
      numero: i,
      fecha: fecha.toISOString(),
      capital: Math.round(capital * 100) / 100,
      interes: Math.round(interes * 100) / 100,
      total: Math.round(cuota * 100) / 100,
      estado,
    });
  }
  return cuotas;
}

export function calcularCuotaMensual(monto: number, plazoMeses: number, tasaAnual = 0.18): number {
  const r = tasaAnual / 12;
  if (plazoMeses <= 0 || monto <= 0) return 0;
  if (r === 0) return monto / plazoMeses;
  return (
    (monto * r * Math.pow(1 + r, plazoMeses)) / (Math.pow(1 + r, plazoMeses) - 1)
  );
}

export const TIPOS_CREDITO = ['Personal', 'Consumo', 'Negocio', 'Vivienda'] as const;

export const LABEL_TIPO_MOVIMIENTO: Record<TipoMovimiento, string> = {
  deposito: 'Depósito',
  retiro: 'Retiro',
  transferencia: 'Transferencia',
};

export const LABEL_ESTADO_CREDITO: Record<EstadoCredito, string> = {
  aprobado: 'Aprobado',
  rechazado: 'Rechazado',
  pendiente: 'Pendiente',
  activo: 'Activo',
  pagado: 'Pagado',
  vencido: 'Vencido',
};
