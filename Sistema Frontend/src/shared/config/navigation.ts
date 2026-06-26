// Menú lateral y permisos por rol
import type { Rol } from '@entities/usuario/model';
import { ROUTES } from './routes';

export interface NavItem {
  to: string;
  label: string;
  roles: Rol[];
  /** Si true, requiere cuenta activa seleccionada */
  requiereCuenta?: boolean;
}

/** Módulos del cliente / operador — enfoque ahorro */
export const USER_NAV_ITEMS: NavItem[] = [
  { to: ROUTES.DASHBOARD, label: 'Inicio', roles: ['cliente', 'operador'], requiereCuenta: true },
  { to: ROUTES.MIS_AHORROS, label: 'Movimientos', roles: ['cliente', 'operador'], requiereCuenta: true },
  { to: ROUTES.PAGOS, label: 'Registrar aporte', roles: ['cliente', 'operador'], requiereCuenta: true },
  { to: ROUTES.CALENDARIO, label: 'Calendario', roles: ['cliente', 'operador'], requiereCuenta: true },
  { to: ROUTES.MI_CUENTA, label: 'Mi Cuenta', roles: ['cliente', 'operador'], requiereCuenta: true },
  { to: ROUTES.PERFIL, label: 'Perfil', roles: ['cliente', 'operador'] },
];

/** Panel del contador */
export const CONTADOR_NAV_ITEMS: NavItem[] = [
  { to: ROUTES.CONTADOR_VERIFICACION, label: 'Verificar pagos', roles: ['contador'] },
  { to: ROUTES.PERFIL, label: 'Perfil', roles: ['contador'] },
];

/** Panel de administración */
export const ADMIN_NAV_ITEMS: NavItem[] = [
  { to: ROUTES.ADMIN, label: 'Dashboard', roles: ['admin'] },
  { to: ROUTES.ADMIN_SOCIOS, label: 'Socios / Clientes', roles: ['admin'] },
  { to: ROUTES.ADMIN_CUENTAS_AHORRO, label: 'Cuentas de ahorro', roles: ['admin'] },
  { to: ROUTES.ADMIN_PAGOS, label: 'Aportes', roles: ['admin'] },
  { to: ROUTES.ADMIN_MOVIMIENTOS, label: 'Movimientos', roles: ['admin'] },
  { to: ROUTES.ADMIN_REPORTES, label: 'Reportes', roles: ['admin'] },
  { to: ROUTES.ADMIN_USUARIOS_ROLES, label: 'Usuarios y roles', roles: ['admin'] },
  { to: ROUTES.ADMIN_CONFIGURACION, label: 'Configuración', roles: ['admin'] },
];

export const ALL_NAV_ITEMS: NavItem[] = [...USER_NAV_ITEMS, ...CONTADOR_NAV_ITEMS, ...ADMIN_NAV_ITEMS];

/** Permisos de ruta → roles permitidos */
export const ROUTE_ACCESS: Record<string, Rol[]> = ALL_NAV_ITEMS.reduce(
  (acc, item) => {
    const existentes = acc[item.to] ?? [];
    acc[item.to] = [...new Set([...existentes, ...item.roles])];
    return acc;
  },
  {
    [ROUTES.ELEGIR_CUENTA]: ['cliente', 'operador'],
    [ROUTES.CONTADOR_VERIFICACION]: ['contador'],
    [ROUTES.SHOWCASE]: ['admin'],
  } as Record<string, Rol[]>,
);

export function getNavItemsForRole(rol: Rol): NavItem[] {
  if (rol === 'admin') return ADMIN_NAV_ITEMS;
  if (rol === 'contador') return CONTADOR_NAV_ITEMS;
  return USER_NAV_ITEMS.filter((item) => item.roles.includes(rol));
}

export function getHomeRouteForRole(rol: Rol): string {
  if (rol === 'admin') return ROUTES.ADMIN;
  if (rol === 'contador') return ROUTES.CONTADOR_VERIFICACION;
  return ROUTES.ELEGIR_CUENTA;
}

export function canAccessRoute(rol: Rol, path: string): boolean {
  const allowed = ROUTE_ACCESS[path];
  if (!allowed) return true;
  return allowed.includes(rol);
}

export function isAdminRole(rol: Rol): boolean {
  return rol === 'admin';
}
