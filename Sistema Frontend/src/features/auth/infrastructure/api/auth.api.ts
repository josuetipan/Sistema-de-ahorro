import { httpClient } from '@shared/lib/httpClient';
import { API_CONFIG } from '@shared/config/api';
import type {
  BackendEnvelope,
  LoginResponseBody,
  RegisterDTO,
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

export async function postRegister(payload: RegisterDTO): Promise<LoginResponseBody> {
  const { data } = await httpClient.post<BackendEnvelope<LoginResponseBody>>(
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
  const { data } = await httpClient.post<BackendEnvelope<{ accessToken: string }>>(
    API_CONFIG.endpoints.auth.refresh,
  );
  return { token: data.body.accessToken };
}
