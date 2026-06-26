export const META_MENSUAL_OBLIGATORIA = 25;

export type EstadoPagoAhorro = 'PENDIENTE_VERIFICACION' | 'VERIFICADO' | 'RECHAZADO';

export interface PagoAhorro {
  id: string;
  cuentaId: string;
  socioNombre: string;
  numeroCuenta: string;
  monto: number;
  fecha: string;
  mes: string;
  comprobante: string;
  archivoNombre?: string;
  comprobanteUrl?: string;
  estado: EstadoPagoAhorro;
  verificadoPor?: string;
  fechaVerificacion?: string;
  motivoRechazo?: string;
}

export interface RegistrarPagoInput {
  cuentaId: string;
  socioNombre: string;
  numeroCuenta: string;
  monto: number;
  fecha: string;
  comprobante: string;
  archivoNombre?: string;
  comprobanteUrl?: string;
}

export interface ResumenAhorro {
  metaMensual: number;
  progresoMes: number;
  progresoPorcentaje: number;
  metaCumplida: boolean;
  excedenteMes: number;
  saldoDisponible: number;
  saldoPendiente: number;
}
