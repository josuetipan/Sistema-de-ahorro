import { httpClient } from '@shared/lib/httpClient';
import { API_CONFIG } from '@shared/config/api';
import type {
  BackendEnvelope,
  LoginResponseBody,
  RegisterDTO,
  RegisterResponseBody,
  ResetPasswordRequest,
  ResetPasswordResponseBody,
} from '../dtos/auth.dto';

export async function postLogin(email: string, password: string): Promise<LoginResponseBody> {
  const { data } = await httpClient.post<BackendEnvelope<LoginResponseBody>>(
    API_CONFIG.endpoints.auth.login,
    { email, password },
  );
  return data.body;
}

export async function postLogout(): Promise<void> {
  await httpClient.post(API_CONFIG.endpoints.auth.logout);
}

export async function postRegister(payload: RegisterDTO): Promise<RegisterResponseBody> {
  const { data } = await httpClient.post<BackendEnvelope<RegisterResponseBody>>(
    API_CONFIG.endpoints.auth.register,
    payload,
  );
  return data.body;
}

export async function postResetPassword(
  payload: ResetPasswordRequest,
): Promise<ResetPasswordResponseBody> {
  const { data } = await httpClient.post<BackendEnvelope<ResetPasswordResponseBody>>(
    API_CONFIG.endpoints.auth.resetPassword,
    payload,
  );
  return data.body;
}

export async function postRefreshToken(): Promise<{ token: string }> {
  const refreshToken = localStorage.getItem('auth_refresh_token');
  const { data } = await httpClient.post<
    BackendEnvelope<LoginResponseBody> | LoginResponseBody
  >(
    API_CONFIG.endpoints.auth.refresh,
    { refreshToken },
  );
  const body = 'body' in data ? data.body : data;
  return { token: body.accessToken };
}
