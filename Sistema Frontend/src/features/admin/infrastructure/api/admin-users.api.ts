import { httpClient } from '@shared/lib/httpClient';
import { API_CONFIG } from '@shared/config/api';
import type { BackendEnvelope, RegisterDTO, RegisterResponseBody } from '@features/auth/infrastructure/dtos/auth.dto';

export interface AdminUser {
  id: string;
  usuario: string;
  email: string | null;
  fullName: string;
  identification: string | null;
  phoneNumber: string | null;
  roleCode: string;
  roleName: string;
  isActive: boolean;
  lastLogin: string | null;
  createdAt: string;
}

function unwrap<T>(data: BackendEnvelope<T> | T): T {
  return data && typeof data === 'object' && 'body' in data ? data.body : data;
}

export async function getAdminUsers(): Promise<AdminUser[]> {
  const { data } = await httpClient.get<BackendEnvelope<AdminUser[]> | AdminUser[]>(API_CONFIG.endpoints.auth.users);
  return unwrap(data);
}

export async function createAdminUser(payload: RegisterDTO): Promise<RegisterResponseBody> {
  const { data } = await httpClient.post<BackendEnvelope<RegisterResponseBody>>(
    API_CONFIG.endpoints.auth.register,
    payload,
  );
  return data.body;
}

export async function setAdminUserStatus(id: string, isActive: boolean): Promise<AdminUser> {
  const { data } = await httpClient.patch<BackendEnvelope<AdminUser> | AdminUser>(
    `${API_CONFIG.endpoints.auth.users}/${id}/status`,
    { isActive },
  );
  return unwrap(data);
}

export async function updateAdminUser(
  id: string,
  payload: Partial<Pick<AdminUser, 'fullName' | 'email' | 'identification' | 'phoneNumber'>> & { roleCode?: string },
): Promise<AdminUser> {
  const { data } = await httpClient.patch<BackendEnvelope<AdminUser> | AdminUser>(
    `${API_CONFIG.endpoints.auth.users}/${id}`,
    payload,
  );
  return unwrap(data);
}