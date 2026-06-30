import { httpClient } from '@shared/lib/httpClient';
import { API_CONFIG } from '@shared/config/api';
import type { ConfiguracionMetaAhorro } from '../../domain/ahorro.entity';

interface BackendEnvelope<T> {
  code: number;
  status: string;
  body: T;
}

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

export async function getMetaAhorroApi(): Promise<ConfiguracionMetaAhorro> {
  const { data } = await httpClient.get<
    BackendEnvelope<ConfiguracionMetaAhorro> | ConfiguracionMetaAhorro
  >(API_CONFIG.endpoints.ahorro.meta);

  return 'body' in data ? data.body : data;
}
