// Tipos del slice transacción: Transaccion y TipoTransaccion
export type TipoTransaccion = 'deposito' | 'retiro' | 'transferencia' | 'pago_credito';

export interface Transaccion {
  id: string;
  tipo: TipoTransaccion;
  monto: number;
  moneda: string;
  cuentaOrigenId: string;
  cuentaDestinoId?: string;
  descripcion?: string;
  fecha: string;
}
