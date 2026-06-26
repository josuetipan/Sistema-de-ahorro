import { httpClient } from '@shared/lib/httpClient';
import { API_CONFIG } from '@shared/config/api';

export async function postDeposito(cuentaId: string, monto: number): Promise<void> {
  await httpClient.post(`${API_CONFIG.endpoints.ahorros}/deposito`, { cuentaId, monto });
}

export async function postRetiro(cuentaId: string, monto: number): Promise<void> {
  await httpClient.post(`${API_CONFIG.endpoints.ahorros}/retiro`, { cuentaId, monto });
}

export async function getMetasApi(): Promise<unknown[]> {
  const { data } = await httpClient.get(`${API_CONFIG.endpoints.ahorros}/metas`);
  return data;
}
