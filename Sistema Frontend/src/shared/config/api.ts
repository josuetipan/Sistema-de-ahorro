// URLs y endpoints base de la API REST
import { env } from './env';

export const API_CONFIG = {
  baseURL: env.VITE_API_URL,
  timeout: 30000,
  endpoints: {
    auth: {
      login: '/auth/login',
      logout: '/auth/logout',
      register: '/auth/register',
      refresh: '/auth/refresh',
    },
    usuarios: '/usuarios',
    cuentas: '/cuentas',
    creditos: '/creditos',
    transacciones: '/transacciones',
    ahorros: '/ahorros',
    transferencias: '/transferencias',
    reportes: '/reportes',
  },
} as const;
