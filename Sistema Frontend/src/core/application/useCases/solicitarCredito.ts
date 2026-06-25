// Caso de uso: solicitar un nuevo crédito
import { Dinero } from '@core/domain/valueObjects/Dinero';
import type { CreditoService } from '../services/CreditoService';

export interface SolicitarCreditoInput {
  cuentaId: string;
  monto: number;
  moneda: string;
  plazoMeses: number;
}

export async function solicitarCredito(creditoService: CreditoService, input: SolicitarCreditoInput) {
  const monto = new Dinero(input.monto, input.moneda);
  return creditoService.solicitar(input.cuentaId, monto, input.plazoMeses);
}
