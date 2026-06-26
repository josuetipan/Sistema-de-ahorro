// API del slice crédito: listado y detalle
import { httpClient } from '@shared/lib/httpClient';
import { API_CONFIG } from '@shared/config/api';
import type { Credito } from '../model';

export async function getCreditos(): Promise<Credito[]> {
  const { data } = await httpClient.get<Credito[]>(API_CONFIG.endpoints.creditos);
  return data;
}

export async function getCreditoById(id: string): Promise<Credito> {
  const { data } = await httpClient.get<Credito>(`${API_CONFIG.endpoints.creditos}/${id}`);
  return data;
}
