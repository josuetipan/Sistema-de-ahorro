// Caso de uso: realizar transferencia entre cuentas
import { Dinero } from '@core/domain/valueObjects/Dinero';
import type { CuentaService } from '../services/CuentaService';

export interface RealizarTransferenciaInput {
  cuentaOrigenId: string;
  cuentaDestinoId: string;
  monto: number;
  moneda: string;
}

export async function realizarTransferencia(
  cuentaService: CuentaService,
  input: RealizarTransferenciaInput,
): Promise<void> {
  const monto = new Dinero(input.monto, input.moneda);
  await cuentaService.transferir(input.cuentaOrigenId, input.cuentaDestinoId, monto);
}
