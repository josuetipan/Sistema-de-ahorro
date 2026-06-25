// API del slice cuenta: listado y detalle por ID
import { httpClient } from '@shared/lib/httpClient';
import { API_CONFIG } from '@shared/config/api';
import type { Cuenta } from '../model';

export async function getCuentas(): Promise<Cuenta[]> {
  const { data } = await httpClient.get<Cuenta[]>(API_CONFIG.endpoints.cuentas);
  return data;
}

export async function getCuentaById(id: string): Promise<Cuenta> {
  const { data } = await httpClient.get<Cuenta>(`${API_CONFIG.endpoints.cuentas}/${id}`);
  return data;
}
