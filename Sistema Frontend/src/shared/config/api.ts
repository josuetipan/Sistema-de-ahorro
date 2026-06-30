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
      resetPassword: '/auth/reset-password',
    },
    ahorro: {
      resumen: '/ahorro/resumen',
      cuentas: '/ahorro/cuentas',
      aportes: '/ahorro/aportes',
      miInvitacion: '/ahorro/mi-invitacion',
      meta: '/ahorro/meta',
      misSolicitudes: '/ahorro/mis-solicitudes',
    },
    admin: {
      ahorro: {
        aportes: '/admin/ahorro/aportes',
        meta: '/admin/ahorro/meta',
        socios: '/admin/ahorro/socios',
        solicitudes: '/admin/ahorro/solicitudes',
      },
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
