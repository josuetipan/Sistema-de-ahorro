export interface TransferenciaInput {
  cuentaOrigenId: string;
  cuentaDestinoId: string;
  monto: number;
  concepto?: string;
}

export function validarTransferencia(monto: number, saldo: number): string | null {
  if (monto <= 0) return 'El monto debe ser mayor a cero';
  if (monto > saldo) return 'Saldo insuficiente';
  return null;
}
