// Value object / enum de estados válidos de un crédito
export enum EstadoCreditoVO {
  PENDIENTE = 'pendiente',
  APROBADO = 'aprobado',
  RECHAZADO = 'rechazado',
  ACTIVO = 'activo',
  PAGADO = 'pagado',
  VENCIDO = 'vencido',
}

export function esEstadoCreditoActivo(estado: EstadoCreditoVO): boolean {
  return estado === EstadoCreditoVO.ACTIVO || estado === EstadoCreditoVO.APROBADO;
}
