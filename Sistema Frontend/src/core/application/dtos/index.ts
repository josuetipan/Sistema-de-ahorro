// DTOs de la capa de aplicación para transferencia entre capas
export interface UsuarioDTO {
  id: string;
  email: string;
  nombre: string;
  rol: string;
}

export interface CuentaDTO {
  id: string;
  numero: string;
  saldo: number;
  moneda: string;
}

export interface CreditoDTO {
  id: string;
  monto: number;
  plazoMeses: number;
  estado: string;
}
