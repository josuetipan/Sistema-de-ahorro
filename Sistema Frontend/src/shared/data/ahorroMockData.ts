// Datos demo del módulo de ahorro programado — cuentas de usuario (capa legacy UI)

export type EstadoMesAhorro = 'completo' | 'incompleto' | 'atrasado';

export interface CuentaUsuario {
  id: string;
  nombre: string;
  numeroCuenta: string;
  saldo: number;
  totalAhorrado: number;
  metaMensual: number;
  color: string;
  icono: string;
  fechaApertura: string;
  /** Estado de la cuenta. Acepta los valores del backend (p. ej. 'activa', 'cerrada'). */
  estado: string;
}

/** @deprecated Usar pagos verificados desde features/ahorro. Se mantiene para compatibilidad temporal. */
export interface MovimientoAhorro {
  id: string;
  cuentaId: string;
  fecha: string;
  monto: number;
  descripcion: string;
  comprobante: string;
  mes: string;
}

/** Sincronizado con META_MENSUAL_OBLIGATORIA en features/ahorro/domain/pago.entity */
export const META_AHORRO_MENSUAL_DEFAULT = 25;

export const MOCK_CUENTAS_USUARIO: CuentaUsuario[] = [
  {
    id: 'cta-1',
    nombre: 'Ahorro personal',
    numeroCuenta: 'AH-2026-004821',
    saldo: 12500,
    totalAhorrado: 18500,
    metaMensual: 25,
    color: 'emerald',
    icono: 'savings',
    fechaApertura: '2024-02-15',
    estado: 'activa',
  },
  {
    id: 'cta-2',
    nombre: 'Fondo emergencia',
    numeroCuenta: 'AH-2026-009103',
    saldo: 6200,
    totalAhorrado: 6200,
    metaMensual: 25,
    color: 'sky',
    icono: 'shield',
    fechaApertura: '2025-01-10',
    estado: 'activa',
  },
  {
    id: 'cta-3',
    nombre: 'Meta vacaciones',
    numeroCuenta: 'AH-2026-011547',
    saldo: 3400,
    totalAhorrado: 3400,
    metaMensual: 25,
    color: 'amber',
    icono: 'zap',
    fechaApertura: '2025-08-20',
    estado: 'activa',
  },
];

export const MOCK_CODIGO_INVITACION = 'AHORRO-JTP-7X4K';

export function getCuentaById(id: string): CuentaUsuario | undefined {
  return MOCK_CUENTAS_USUARIO.find((c) => c.id === id);
}
