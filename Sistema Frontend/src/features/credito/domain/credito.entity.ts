export type EstadoCredito = 'aprobado' | 'rechazado' | 'pendiente' | 'activo' | 'pagado' | 'vencido';

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

export interface SolicitudCreditoInput {
  monto: number;
  plazoMeses: number;
  tipoCredito: string;
  motivo: string;
  ingresos: number;
  cuentaId?: string;
}
