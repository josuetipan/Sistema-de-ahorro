// Datos demo para panel administrador
import {
  MOCK_SOCIOS_DATA,
  calcularSaldoTotal,
  type EstadoSocio,
  type Socio as SocioFeature,
} from '@features/socio';
import {
  MOCK_CREDITOS,
  MOCK_MOVIMIENTOS,
  MOCK_PAGOS,
  MOCK_SOLICITUDES,
  buildAmortizacion,
  type Credito,
  type EstadoCuenta,
} from './mockData';

export type { EstadoSocio };
export type TipoMovimientoAdmin = 'deposito' | 'retiro' | 'pago' | 'desembolso';
export type RolSistema = 'admin' | 'operador' | 'cliente';

/** Vista legacy para módulos admin que aún consumen adminMockData */
export interface Socio {
  id: string;
  codigo: string;
  nombre: string;
  cedula: string;
  email: string;
  telefono: string;
  estado: EstadoSocio;
  fechaAlta: string;
  codigoReferencia: string;
  referidoPorId?: string;
  cuentaAhorro?: string;
  saldoAhorro: number;
}

function mapSocioToAdmin(socio: SocioFeature): Socio {
  const primeraCuenta = socio.cuentas[0];
  return {
    id: socio.id,
    codigo: socio.codigoReferencia,
    codigoReferencia: socio.codigoReferencia,
    nombre: socio.nombres,
    cedula: socio.cedula,
    email: socio.email,
    telefono: socio.telefono,
    estado: socio.estado,
    fechaAlta: socio.fechaAlta,
    referidoPorId: socio.referidoPorId,
    cuentaAhorro: primeraCuenta?.numeroCuenta,
    saldoAhorro: calcularSaldoTotal(socio),
  };
}

export interface CuentaAhorroAdmin {
  id: string;
  numeroCuenta: string;
  socioId: string;
  socioNombre: string;
  saldo: number;
  saldoDisponible: number;
  estado: EstadoCuenta;
  fechaApertura: string;
}

export interface SolicitudCreditoAdmin {
  id: string;
  socioId: string;
  solicitante: string;
  email: string;
  monto: number;
  plazoMeses: number;
  tipo: string;
  motivo: string;
  ingresosMensuales: number;
  estado: 'pendiente' | 'aprobado' | 'rechazado';
  fecha: string;
  documentos: { nombre: string; tipo: string }[];
}

export interface MovimientoAdmin {
  id: string;
  fecha: string;
  tipo: TipoMovimientoAdmin;
  socio: string;
  monto: number;
  descripcion: string;
  referencia: string;
}

export type EstadoAporteMensualAdmin =
  | 'pendiente'
  | 'verificado'
  | 'incompleto'
  | 'atrasado'
  | 'rechazado';

export interface AporteMensualAdmin {
  idAporteMensual: string;
  cuentaId: string;
  mes: string;
  monto: number;
  metaMensual: number;
  referencia: string | null;
  comprobante: string;
  archivoNombre: string;
  descripcion: string | null;
  estado: EstadoAporteMensualAdmin;
  fechaRegistro: string;
  createdAt: string;
  numeroCuenta: string;
  cuentaNombre: string;
  socioId: string;
  socioCodigo: string;
  socioNombre: string;
}

export interface UsuarioSistema {
  id: string;
  nombre: string;
  email: string;
  rol: RolSistema;
  activo: boolean;
  ultimoAcceso: string;
}

export interface ConfigCooperativa {
  nombre: string;
  rfc: string;
  direccion: string;
  telefono: string;
  tasaAhorroAnual: number;
  tasaCreditoPersonal: number;
  tasaCreditoConsumo: number;
  plazoMinimoMeses: number;
  plazoMaximoMeses: number;
  tiposCredito: string[];
  montoMinimoCredito: number;
  montoMaximoCredito: number;
  metaAhorroMensual: number;
}

export const MOCK_SOCIOS: Socio[] = MOCK_SOCIOS_DATA.map(mapSocioToAdmin);

export const MOCK_CUENTAS_ADMIN: CuentaAhorroAdmin[] = MOCK_SOCIOS_DATA.flatMap((socio) =>
  socio.cuentas.map((cuenta) => ({
    id: cuenta.id,
    numeroCuenta: cuenta.numeroCuenta,
    socioId: socio.id,
    socioNombre: socio.nombres,
    saldo: cuenta.saldo,
    saldoDisponible: Math.round(cuenta.saldo * 0.85),
    estado:
      cuenta.estado === 'INACTIVA'
        ? 'inactiva'
        : socio.estado === 'pendiente'
          ? 'bloqueada'
          : 'activa',
    fechaApertura: cuenta.fechaApertura,
  })),
);

export const MOCK_SOLICITUDES_ADMIN: SolicitudCreditoAdmin[] = [
  {
    id: 'sol-1',
    socioId: 'soc-1',
    solicitante: 'María González López',
    email: 'maria.gonzalez@correo.com',
    monto: 15000,
    plazoMeses: 12,
    tipo: 'Personal',
    motivo: 'Consolidación de deudas personales',
    ingresosMensuales: 18500,
    estado: 'pendiente',
    fecha: '2026-05-22T08:00:00',
    documentos: [
      { nombre: 'Identificación oficial.pdf', tipo: 'INE' },
      { nombre: 'Comprobante de ingresos.pdf', tipo: 'Ingresos' },
    ],
  },
  {
    id: 'sol-2',
    socioId: 'soc-2',
    solicitante: 'Carlos Ramírez Vega',
    email: 'carlos.ramirez@correo.com',
    monto: 8000,
    plazoMeses: 6,
    tipo: 'Consumo',
    motivo: 'Compra de equipo de trabajo',
    ingresosMensuales: 12000,
    estado: 'pendiente',
    fecha: '2026-05-25T10:30:00',
    documentos: [{ nombre: 'Identificación oficial.pdf', tipo: 'INE' }],
  },
  {
    id: 'sol-3',
    socioId: 'soc-5',
    solicitante: 'Laura Hernández Ruiz',
    email: 'laura.hernandez@correo.com',
    monto: 25000,
    plazoMeses: 24,
    tipo: 'Negocio',
    motivo: 'Ampliación de negocio familiar',
    ingresosMensuales: 28000,
    estado: 'aprobado',
    fecha: '2026-04-10T10:00:00',
    documentos: [
      { nombre: 'Estados financieros.pdf', tipo: 'Financiero' },
      { nombre: 'Identificación oficial.pdf', tipo: 'INE' },
    ],
  },
];

export const MOCK_MOVIMIENTOS_ADMIN: MovimientoAdmin[] = [
  ...MOCK_MOVIMIENTOS.map((m) => ({
    id: m.id,
    fecha: m.fecha,
    tipo: m.tipo === 'transferencia' ? ('desembolso' as const) : m.tipo,
    socio: 'María González López',
    monto: m.monto,
    descripcion: m.descripcion,
    referencia: m.comprobante,
  })),
  {
    id: 'ma-6',
    fecha: '2026-05-18T11:30:00',
    tipo: 'pago',
    socio: 'Carlos Ramírez Vega',
    monto: 1180,
    descripcion: 'Pago cuota crédito consumo',
    referencia: 'PAG-2026-00315',
  },
  {
    id: 'ma-7',
    fecha: '2026-05-24T09:00:00',
    tipo: 'desembolso',
    socio: 'Laura Hernández Ruiz',
    monto: 25000,
    descripcion: 'Desembolso crédito negocio',
    referencia: 'DES-2026-00012',
  },
];

export const MOCK_APORTES_MENSUALES_ADMIN: AporteMensualAdmin[] = [
  {
    idAporteMensual: '1337cc13-701d-4fb5-be4a-00d259c493be',
    cuentaId: '7b62b813-0266-4510-9358-deede4f74dde',
    mes: '2026-06',
    monto: 19.98,
    metaMensual: 20,
    referencia: null,
    comprobante: '123',
    archivoNombre: 'FinnovaLogoPrincipal.png',
    descripcion: null,
    estado: 'pendiente',
    fechaRegistro: '2026-06-29T05:12:01.173Z',
    createdAt: '2026-06-29T05:12:01.173Z',
    numeroCuenta: 'FNV085952020',
    cuentaNombre: 'Ahorro vacaciones',
    socioId: 'e11da36e-f0e1-45ab-8945-ed59025816ee',
    socioCodigo: 'SOC-18BBC0',
    socioNombre: 'JOsue Tipan',
  },
  {
    idAporteMensual: 'acff0a49-8877-43ca-b7c8-33e8bb35be0e',
    cuentaId: '7b62b813-0266-4510-9358-deede4f74dde',
    mes: '2026-06',
    monto: 20,
    metaMensual: 20,
    referencia: null,
    comprobante: '12345678',
    archivoNombre: 'lobby.png',
    descripcion: null,
    estado: 'pendiente',
    fechaRegistro: '2026-06-29T04:40:15.223Z',
    createdAt: '2026-06-29T04:40:15.223Z',
    numeroCuenta: 'FNV085952020',
    cuentaNombre: 'Ahorro vacaciones',
    socioId: 'e11da36e-f0e1-45ab-8945-ed59025816ee',
    socioCodigo: 'SOC-18BBC0',
    socioNombre: 'JOsue Tipan',
  },
  {
    idAporteMensual: '603f7355-2e9c-4755-b48d-5e99e740fc0a',
    cuentaId: '7b62b813-0266-4510-9358-deede4f74dde',
    mes: '2026-06',
    monto: 25,
    metaMensual: 20,
    referencia: 'p',
    comprobante: '1234567',
    archivoNombre: 'Preuba',
    descripcion: 'opcionalsss',
    estado: 'pendiente',
    fechaRegistro: '2026-06-29T04:38:02.514Z',
    createdAt: '2026-06-29T04:38:02.514Z',
    numeroCuenta: 'FNV085952020',
    cuentaNombre: 'Ahorro vacaciones',
    socioId: 'e11da36e-f0e1-45ab-8945-ed59025816ee',
    socioCodigo: 'SOC-18BBC0',
    socioNombre: 'JOsue Tipan',
  },
];

export const MOCK_USUARIOS_SISTEMA: UsuarioSistema[] = [
  {
    id: 'usr-1',
    nombre: 'Carlos Mendoza',
    email: 'admin@ahorro.local',
    rol: 'admin',
    activo: true,
    ultimoAcceso: '2026-05-31T14:00:00',
  },
  {
    id: 'usr-2',
    nombre: 'Operador Principal',
    email: 'operador@ahorro.local',
    rol: 'operador',
    activo: true,
    ultimoAcceso: '2026-05-30T09:15:00',
  },
  {
    id: 'usr-3',
    nombre: 'María González',
    email: 'usuario@ahorro.local',
    rol: 'cliente',
    activo: true,
    ultimoAcceso: '2026-05-31T08:45:00',
  },
  {
    id: 'usr-4',
    nombre: 'Ana Operadora',
    email: 'ana.operadora@ahorro.local',
    rol: 'operador',
    activo: false,
    ultimoAcceso: '2026-04-15T16:20:00',
  },
];

export const MOCK_CONFIG: ConfigCooperativa = {
  nombre: 'Cooperativa Finnova',
  rfc: 'CFI850101ABC',
  direccion: 'Av. Principal 123, Col. Centro',
  telefono: '555-000-0000',
  tasaAhorroAnual: 0.06,
  tasaCreditoPersonal: 0.16,
  tasaCreditoConsumo: 0.18,
  plazoMinimoMeses: 3,
  plazoMaximoMeses: 60,
  tiposCredito: ['Personal', 'Consumo', 'Negocio', 'Vivienda'],
  montoMinimoCredito: 1000,
  montoMaximoCredito: 500000,
  metaAhorroMensual: 500,
};

export const CHART_INGRESOS = [
  { label: 'Ene', value: 42000 },
  { label: 'Feb', value: 38500 },
  { label: 'Mar', value: 51200 },
  { label: 'Abr', value: 47800 },
  { label: 'May', value: 55400 },
];

export const CHART_CARTERA_VENCIDA = [
  { label: 'Ene', value: 3 },
  { label: 'Feb', value: 5 },
  { label: 'Mar', value: 4 },
  { label: 'Abr', value: 7 },
  { label: 'May', value: 6 },
];

export const CHART_SOLICITUDES = [
  { label: 'Ene', value: 8 },
  { label: 'Feb', value: 12 },
  { label: 'Mar', value: 10 },
  { label: 'Abr', value: 15 },
  { label: 'May', value: 18 },
];

export const ADMIN_ALERTAS = [
  { id: 'a1', label: '3 solicitudes de crédito pendientes de revisión', status: 'pendiente', tipo: 'solicitud' },
  { id: 'a2', label: '2 pagos atrasados en cartera activa', status: 'vencido', tipo: 'pago' },
  { id: 'a3', label: '1 cuenta de ahorro bloqueada requiere revisión', status: 'bloqueada', tipo: 'cuenta' },
  { id: 'a4', label: 'Cartera vencida: 6 créditos en mora', status: 'vencido', tipo: 'credito' },
];

export function getCreditosActivosAdmin(): Credito[] {
  return MOCK_CREDITOS.filter((c) => c.estado === 'activo');
}

export function getPagosAtrasados() {
  return MOCK_PAGOS.filter((p) => p.estado === 'pendiente');
}

export function getProximosVencimientos() {
  return getCreditosActivosAdmin().map((c) => ({
    creditoId: c.id,
    socio: c.tipo === 'Consumo' ? 'Carlos Ramírez Vega' : 'María González López',
    monto: c.cuotaMensual,
    fecha: c.proximoVencimiento,
    tipo: c.tipo,
  }));
}

export function getAmortizacionCredito(creditoId: string) {
  const credito = MOCK_CREDITOS.find((c) => c.id === creditoId);
  return credito ? buildAmortizacion(credito) : [];
}

export const ADMIN_STATS = {
  totalSocios: MOCK_SOCIOS.length,
  sociosActivos: MOCK_SOCIOS.filter((s) => s.estado === 'activo').length,
  totalAhorros: MOCK_SOCIOS.reduce((sum, s) => sum + s.saldoAhorro, 0),
  creditosActivos: getCreditosActivosAdmin().length,
  carteraActiva: getCreditosActivosAdmin().reduce((sum, c) => sum + c.monto, 0),
  pagosMes: MOCK_PAGOS.filter((p) => p.estado === 'aprobado').reduce((sum, p) => sum + p.monto, 0),
  solicitudesPendientes: MOCK_SOLICITUDES.filter((s) => s.estado === 'pendiente').length,
};

export const LABEL_TIPO_MOV_ADMIN: Record<TipoMovimientoAdmin, string> = {
  deposito: 'Depósito',
  retiro: 'Retiro',
  pago: 'Pago',
  desembolso: 'Desembolso',
};

export const LABEL_ESTADO_SOCIO: Record<EstadoSocio, string> = {
  activo: 'Activo',
  inactivo: 'Inactivo',
  pendiente: 'Pendiente',
};
