import { httpClient } from '@shared/lib/httpClient';
import { API_CONFIG } from '@shared/config/api';
import type { AuthResponseDTO, RegisterDTO } from '../dtos/auth.dto';

export async function postLogin(email: string, password: string): Promise<AuthResponseDTO> {
  const { data } = await httpClient.post<AuthResponseDTO>(API_CONFIG.endpoints.auth.login, {
    email,
    password,
  });
  return data;
}

export async function postLogout(): Promise<void> {
  await httpClient.post(API_CONFIG.endpoints.auth.logout);
}

export async function postRegister(payload: RegisterDTO): Promise<AuthResponseDTO> {
  const { data } = await httpClient.post<AuthResponseDTO>(API_CONFIG.endpoints.auth.register, payload);
  return data;
}

export async function postRefreshToken(): Promise<{ token: string }> {
  const { data } = await httpClient.post<{ token: string }>(API_CONFIG.endpoints.auth.refresh);
  return data;
}
