import type { EstadoCredito } from '../../domain/credito.entity';

export interface CreditoDTO {
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

export interface SolicitarCreditoDTO {
  monto: number;
  plazoMeses: number;
  cuentaId: string;
  tipoCredito?: string;
  motivo?: string;
  ingresos?: number;
}
