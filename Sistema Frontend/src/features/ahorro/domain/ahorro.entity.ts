export interface MetaAhorro {
  id: string;
  nombre: string;
  montoObjetivo: number;
  montoActual: number;
}

export interface DepositoInput {
  cuentaId: string;
  monto: number;
}

export interface RetiroInput {
  cuentaId: string;
  monto: number;
}
