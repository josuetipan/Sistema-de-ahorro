// Instancia de Axios con JWT, baseURL desde env y manejo de errores 401
import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG } from '@shared/config/api';
import { ROUTES } from '@shared/config/routes';
import { env } from '@shared/config/env';
import { isMockToken } from '@features/auth/infrastructure/mocks/auth.mock';

const TOKEN_KEY = 'auth_token';

export const httpClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

httpClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && !env.VITE_MOCK_AUTH) {
      const token = localStorage.getItem(TOKEN_KEY);
      if (isMockToken(token)) return Promise.reject(error);
      localStorage.removeItem(TOKEN_KEY);
      if (window.location.pathname !== ROUTES.LOGIN) {
        window.location.href = ROUTES.LOGIN;
      }
    }
    return Promise.reject(error);
  },
);

export function setAuthToken(token: string | null): void {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}
