export interface MetaAhorro {
  id: string;
  nombre: string;
  montoObjetivo: number;
  montoActual: number;
}

export interface ConfiguracionMetaAhorro {
  idConfiguracionMetaAhorro: string;
  metaMensual: number;
  metaMinima: number;
  metaMaxima: number;
  updatedAt: string;
}

export interface DepositoInput {
  cuentaId: string;
  monto: number;
}

export interface RetiroInput {
  cuentaId: string;
  monto: number;
}
