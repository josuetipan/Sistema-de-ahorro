// Instancia de Axios con JWT, baseURL desde env y manejo de errores 401
import axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';
import { API_CONFIG } from '@shared/config/api';
import { ROUTES } from '@shared/config/routes';
import { env } from '@shared/config/env';
import { isMockToken } from '@features/auth/infrastructure/mocks/auth.mock';

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';

interface RefreshResponseBody {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user?: unknown;
}

interface BackendEnvelope<T> {
  code: number;
  status: string;
  body: T;
}

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

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

/**
 * Endpoints donde un 401 es un error de validación esperado (p. ej. contraseña
 * actual incorrecta) y NO debe disparar el cierre de sesión global.
 */
const SKIP_AUTH_REDIRECT_ENDPOINTS = [API_CONFIG.endpoints.auth.resetPassword];

function syncPersistedAuthToken(accessToken: string, refreshToken: string): void {
  const persisted = localStorage.getItem('auth_user');
  if (!persisted) return;

  try {
    const parsed = JSON.parse(persisted) as {
      state?: Record<string, unknown>;
      version?: number;
    };
    localStorage.setItem(
      'auth_user',
      JSON.stringify({
        ...parsed,
        state: {
          ...(parsed.state ?? {}),
          token: accessToken,
          refreshToken,
        },
      }),
    );
  } catch {
    // Si el storage persistido no tiene el formato esperado, el token plano basta para la sesion actual.
  }
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (!refreshToken) return null;

  const { data } = await axios.post<BackendEnvelope<RefreshResponseBody> | RefreshResponseBody>(
    `${API_CONFIG.baseURL}${API_CONFIG.endpoints.auth.refresh}`,
    { refreshToken },
    {
      timeout: API_CONFIG.timeout,
      headers: { 'Content-Type': 'application/json' },
    },
  );

  const body = data && typeof data === 'object' && 'body' in data ? data.body : data;
  setAuthToken(body.accessToken, body.refreshToken);
  syncPersistedAuthToken(body.accessToken, body.refreshToken);
  return body.accessToken;
}

function clearAuthAndRedirect(): void {
  setAuthToken(null);
  localStorage.removeItem('auth_user');
  if (window.location.pathname !== ROUTES.LOGIN) {
    window.location.href = ROUTES.LOGIN;
  }
}

httpClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const requestUrl = error.config?.url ?? '';
    const isSkippedEndpoint = SKIP_AUTH_REDIRECT_ENDPOINTS.some((endpoint) =>
      requestUrl.includes(endpoint),
    );
    const isRefreshEndpoint = requestUrl.includes(API_CONFIG.endpoints.auth.refresh);
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    const isAuthError = error.response?.status === 401 || error.response?.status === 403;
    const canTryRefresh = isAuthError && (!isSkippedEndpoint || error.response?.status === 403);

    if (
      canTryRefresh &&
      !env.VITE_MOCK_AUTH &&
      !isRefreshEndpoint
    ) {
      const token = localStorage.getItem(TOKEN_KEY);
      if (isMockToken(token)) return Promise.reject(error);

      if (originalRequest && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const accessToken = await refreshAccessToken();
          if (accessToken) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return httpClient(originalRequest as AxiosRequestConfig);
          }
        } catch {
          clearAuthAndRedirect();
          return Promise.reject(error);
        }
      }

      clearAuthAndRedirect();
    }
    return Promise.reject(error);
  },
);

export function setAuthToken(token: string | null, refreshToken?: string | null): void {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }

  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  } else if (refreshToken === null || token === null) {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
}
