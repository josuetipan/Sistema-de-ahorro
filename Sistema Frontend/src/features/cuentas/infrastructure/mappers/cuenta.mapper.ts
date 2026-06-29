import type { CuentaUsuario } from '@shared/data/ahorroMockData';
import type {
  Aporte,
  AportesPage,
  CalendarioAhorro,
  CuentaCreada,
  CuentaResumen,
  Invitacion,
  ResumenAhorroGlobal,
} from '../../domain/cuenta.entity';
import type {
  AporteDTO,
  AportesResponseBody,
  CalendarioAhorroDTO,
  CuentaCreadaDTO,
  CuentaResumenDTO,
  InvitacionDTO,
  ResumenAhorroDTO,
} from '../dtos/cuenta.dto';

/** Paleta soportada por SocioCard (COLOR_MAP) para asignar color por posición. */
const COLOR_PALETTE = ['emerald', 'sky', 'amber'] as const;
const SUPPORTED_ICONS = ['savings', 'shield', 'zap'];

/** Mapea un color hex (enviado al crear) al nombre soportado por la UI. */
const HEX_TO_COLOR: Record<string, string> = {
  '#22c55e': 'emerald',
  '#0ea5e9': 'sky',
  '#f59e0b': 'amber',
};

function toCuentaResumen(dto: CuentaResumenDTO): CuentaResumen {
  return {
    cuentaId: dto.cuentaId,
    numeroCuenta: dto.numeroCuenta,
    nombre: dto.nombre,
    estado: dto.estado,
    saldo: dto.saldo,
    saldoDisponible: dto.saldoDisponible,
    saldoPendiente: dto.saldoPendiente,
    progresoMes: dto.progresoMes,
    metaMensual: dto.metaMensual,
    metaCumplida: dto.metaCumplida,
  };
}

export function toResumenGlobal(dto: ResumenAhorroDTO): ResumenAhorroGlobal {
  return {
    mesActual: dto.mesActual,
    metaMensual: dto.metaMensual,
    metaMinima: dto.metaMinima,
    metaMaxima: dto.metaMaxima,
    totalAhorradoGlobal: dto.totalAhorradoGlobal,
    saldoDisponibleGlobal: dto.saldoDisponibleGlobal,
    saldoPendienteGlobal: dto.saldoPendienteGlobal,
    progresoMesGlobal: dto.progresoMesGlobal,
    cantidadCuentas: dto.cantidadCuentas,
    cuentas: (dto.cuentas ?? []).map(toCuentaResumen),
  };
}

export function toAporte(dto: AporteDTO): Aporte {
  return {
    id: dto.idAporteMensual,
    cuentaId: dto.cuentaId,
    mes: dto.mes,
    monto: dto.monto,
    estado: dto.estado,
    fechaRegistro: dto.fechaRegistro,
    descripcion: dto.descripcion,
    comprobante: dto.comprobante,
  };
}

export function toAportesPage(body: AportesResponseBody): AportesPage {
  return {
    data: (body.data ?? []).map(toAporte),
    page: body.meta?.page ?? 1,
    limit: body.meta?.limit ?? 0,
    total: body.meta?.total ?? 0,
    totalPages: body.meta?.totalPages ?? 0,
  };
}

export function toInvitacion(dto: InvitacionDTO): Invitacion {
  return {
    idInvitacion: dto.idInvitacion,
    codigo: dto.codigo,
    activo: dto.activo,
    createdAt: dto.createdAt,
    titular: dto.titular,
    socioCodigo: dto.socioCodigo,
  };
}

export function toCalendarioAhorro(dto: CalendarioAhorroDTO): CalendarioAhorro {
  return {
    cuentaId: dto.cuentaId,
    numeroCuenta: dto.numeroCuenta,
    nombre: dto.nombre,
    anio: dto.anio,
    totalAhorrado: dto.totalAhorrado,
    mesesCumplidos: dto.mesesCumplidos,
    metaMensual: dto.metaMensual,
    metaMinima: dto.metaMinima,
    metaMaxima: dto.metaMaxima,
    meses: (dto.meses ?? []).map((m) => ({
      mes: m.mes,
      numeroMes: m.numeroMes,
      metaMensual: m.metaMensual,
      metaMinima: m.metaMinima,
      metaMaxima: m.metaMaxima,
      montoAportado: m.montoAportado,
      estado: m.estado,
      cumplido: m.cumplido,
      aporteId: m.aporteId,
      comprobante: m.comprobante,
    })),
  };
}

export function toCuentaCreada(dto: CuentaCreadaDTO): CuentaCreada {
  return {
    idCuenta: dto.idCuenta,
    numeroCuenta: dto.numeroCuenta,
    nombre: dto.nombre,
    tipo: dto.tipo,
    estado: dto.estado,
    moneda: dto.moneda,
    saldo: dto.saldo,
    saldoDisponible: dto.saldoDisponible,
    totalAhorrado: dto.totalAhorrado,
    color: dto.color,
    icono: dto.icono,
    fechaApertura: dto.fechaApertura,
    socioId: dto.socioId,
    titular: dto.titular,
  };
}

/** Convierte el resumen de cuenta del backend al modelo legacy usado por la UI/store. */
export function cuentaResumenToCuentaUsuario(c: CuentaResumen, index = 0): CuentaUsuario {
  return {
    id: c.cuentaId,
    nombre: c.nombre,
    numeroCuenta: c.numeroCuenta,
    saldo: c.saldo,
    totalAhorrado: c.saldoDisponible,
    metaMensual: c.metaMensual,
    color: COLOR_PALETTE[index % COLOR_PALETTE.length],
    icono: 'savings',
    fechaApertura: '',
    estado: c.estado,
  };
}

/** Convierte una cuenta recién creada al modelo legacy usado por la UI/store. */
export function cuentaCreadaToCuentaUsuario(c: CuentaCreada): CuentaUsuario {
  return {
    id: c.idCuenta,
    nombre: c.nombre,
    numeroCuenta: c.numeroCuenta,
    saldo: c.saldo,
    totalAhorrado: c.totalAhorrado,
    metaMensual: 0,
    color: HEX_TO_COLOR[c.color] ?? 'emerald',
    icono: SUPPORTED_ICONS.includes(c.icono) ? c.icono : 'savings',
    fechaApertura: c.fechaApertura ? c.fechaApertura.slice(0, 10) : '',
    estado: c.estado,
  };
}
