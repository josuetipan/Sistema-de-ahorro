// Constantes de rutas del frontend para navegación centralizada
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTRO: '/registro',
  /** Cambio de contraseña obligatorio (pending_password_reset) */
  CAMBIAR_PASSWORD: '/cambiar-password',
  /** Selección de cuenta (antes del sistema) */
  ELEGIR_CUENTA: '/elegir-cuenta',
  /** Cliente / operador */
  DASHBOARD: '/dashboard',
  MI_CUENTA: '/mi-cuenta',
  MIS_AHORROS: '/mis-ahorros',
  PAGOS: '/pagos',
  CALENDARIO: '/calendario',
  INVITAR: '/invitar',
  HISTORIAL: '/historial',
  PERFIL: '/perfil',
  /** Administrador */
  ADMIN: '/admin',
  ADMIN_SOCIOS: '/admin/socios',
  ADMIN_CUENTAS_AHORRO: '/admin/cuentas-ahorro',
  ADMIN_PAGOS: '/admin/pagos',
  ADMIN_MOVIMIENTOS: '/admin/movimientos',
  ADMIN_REPORTES: '/admin/reportes',
  ADMIN_USUARIOS_ROLES: '/admin/usuarios-roles',
  ADMIN_CONFIGURACION: '/admin/configuracion',
  CONTADOR_VERIFICACION: '/contador/verificacion',
  SHOWCASE: '/showcase',
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];

/** Rutas que requieren tener una cuenta de ahorro seleccionada */
export const ROUTES_REQUIEREN_CUENTA: string[] = [
  ROUTES.DASHBOARD,
  ROUTES.MI_CUENTA,
  ROUTES.MIS_AHORROS,
  ROUTES.PAGOS,
  ROUTES.CALENDARIO,
  ROUTES.HISTORIAL,
];
