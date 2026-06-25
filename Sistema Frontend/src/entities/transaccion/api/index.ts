// API del slice transacción: historial de movimientos
import { httpClient } from '@shared/lib/httpClient';
import { API_CONFIG } from '@shared/config/api';
import type { Transaccion } from '../model';

export async function getTransacciones(params?: { cuentaId?: string }): Promise<Transaccion[]> {
  const { data } = await httpClient.get<Transaccion[]>(API_CONFIG.endpoints.transacciones, { params });
  return data;
}
