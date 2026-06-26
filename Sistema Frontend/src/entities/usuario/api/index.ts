// API del slice usuario: consultas y actualización
import { httpClient } from '@shared/lib/httpClient';
import { API_CONFIG } from '@shared/config/api';
import type { Usuario } from '../model';

export async function getUsuario(id: string): Promise<Usuario> {
  const { data } = await httpClient.get<Usuario>(`${API_CONFIG.endpoints.usuarios}/${id}`);
  return data;
}

export async function updateUsuario(id: string, payload: Partial<Usuario>): Promise<Usuario> {
  const { data } = await httpClient.patch<Usuario>(`${API_CONFIG.endpoints.usuarios}/${id}`, payload);
  return data;
}
