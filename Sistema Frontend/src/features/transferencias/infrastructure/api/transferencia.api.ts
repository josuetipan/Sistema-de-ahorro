import { httpClient } from '@shared/lib/httpClient';
import { API_CONFIG } from '@shared/config/api';

export async function postTransferencia(payload: {
  cuentaOrigenId: string;
  cuentaDestinoId: string;
  monto: number;
}): Promise<void> {
  await httpClient.post(API_CONFIG.endpoints.transferencias, payload);
}

export async function getHistorialApi(): Promise<unknown[]> {
  const { data } = await httpClient.get(`${API_CONFIG.endpoints.transferencias}/historial`);
  return data;
}
