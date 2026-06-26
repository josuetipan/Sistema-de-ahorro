// Tipos del slice cuenta: Cuenta, TipoCuenta y EstadoCuenta
export type TipoCuenta = 'ahorro' | 'corriente' | 'credito';

export type EstadoCuenta = 'activa' | 'inactiva' | 'bloqueada' | 'cerrada';

export interface Cuenta {
  id: string;
  numero: string;
  tipo: TipoCuenta;
  estado: EstadoCuenta;
  saldo: number;
  moneda: string;
  usuarioId: string;
  createdAt: string;
}
