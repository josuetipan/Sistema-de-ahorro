// Variables de entorno tipadas expuestas por Vite
export const env = {
  VITE_API_URL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
  VITE_APP_NAME: import.meta.env.VITE_APP_NAME ?? 'Finnova',
  VITE_APP_ENV: import.meta.env.VITE_APP_ENV ?? 'development',
  /** true = login/registro sin backend real (usa AuthMockAdapter) */
  VITE_MOCK_AUTH: import.meta.env.VITE_MOCK_AUTH === 'true',
} as const;
