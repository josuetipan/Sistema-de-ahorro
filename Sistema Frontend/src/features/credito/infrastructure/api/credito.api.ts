import { httpClient } from '@shared/lib/httpClient';
import { API_CONFIG } from '@shared/config/api';
import type { SolicitarCreditoDTO } from '../dtos/credito.dto';

export async function postSolicitudCredito(payload: SolicitarCreditoDTO): Promise<void> {
  await httpClient.post(API_CONFIG.endpoints.creditos, payload);
}

export async function postPagarCuota(creditoId: string, cuotaNumero: number): Promise<void> {
  await httpClient.post(`${API_CONFIG.endpoints.creditos}/${creditoId}/cuotas/${cuotaNumero}/pagar`);
}
