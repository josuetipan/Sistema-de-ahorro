import { Link, NavLink, useNavigate } from 'react-router-dom';
import { env } from '@shared/config/env';
import { ROUTES } from '@shared/config/routes';
import { useAuth } from '@shared/hooks/useAuth';
import { useSidebarStore } from '@shared/hooks/useSidebarStore';
import { getHomeRouteForRole, getNavItemsForRole, isAdminRole } from '@shared/config/navigation';
import { useCuentaActivaStore } from '@shared/hooks/useCuentaActivaStore';
import { NavIcon } from '@shared/ui/atoms/NavIcon';
import type { NavIconName } from '@shared/ui/atoms/NavIcon';
import { PerfilAvatar } from '@features/perfil/presentation/components/PerfilAvatar';

const ROUTE_ICONS: Record<string, NavIconName> = {
  [ROUTES.DASHBOARD]:               'dashboard',
  [ROUTES.MI_CUENTA]:               'account',
  [ROUTES.MIS_AHORROS]:             'savings',
  [ROUTES.PAGOS]:                   'upload',
  [ROUTES.CALENDARIO]:              'chart',
  [ROUTES.SOLICITUDES_CUENTA]:      'file',
  [ROUTES.HISTORIAL]:               'history',
  [ROUTES.PERFIL]:                  'profile',
  [ROUTES.ADMIN]:                   'dashboard',
  [ROUTES.ADMIN_SOCIOS]:            'users',
  [ROUTES.ADMIN_CUENTAS_AHORRO]:    'savings',
  [ROUTES.ADMIN_PAGOS]:             'payments',
  [ROUTES.ADMIN_MOVIMIENTOS]:       'transfer',
  [ROUTES.ADMIN_REPORTES]:          'chart',
  [ROUTES.ADMIN_USUARIOS_ROLES]:    'users',
  [ROUTES.ADMIN_CONFIGURACION]:     'settings',
  [ROUTES.SHOWCASE]:                'components',
};

const ADMIN_SECTIONS = [
  { label: 'General',   routes: [ROUTES.ADMIN] },
  { label: 'Socios',    routes: [ROUTES.ADMIN_SOCIOS, ROUTES.ADMIN_CUENTAS_AHORRO] },
  { label: 'Sistema',   routes: [ROUTES.ADMIN_CONFIGURACION] },
];

export const SIDEBAR_HEADER_HEIGHT_CLASS = 'h-14';
export const SIDEBAR_WIDTH_EXPANDED  = 'w-60';
export const SIDEBAR_WIDTH_COLLAPSED = 'w-[52px]';

export function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isCollapsed = useSidebarStore((s) => s.isCollapsed);
  const toggle      = useSidebarStore((s) => s.toggle);
  const collapse    = useSidebarStore((s) => s.collapse);
  const navItems    = user ? getNavItemsForRole(user.rol) : [];
  const isAdmin     = user ? isAdminRole(user.rol) : false;
  const homeRoute   = user ? getHomeRouteForRole(user.rol) : ROUTES.DASHBOARD;

  const cuentaActivaId = useCuentaActivaStore((s) => s.cuentaActivaId);
  const cuentas = useCuentaActivaStore((s) => s.cuentas);
  const limpiarCuenta = useCuentaActivaStore((s) => s.limpiarCuenta);
  const cuentaActiva = cuentaActivaId ? cuentas.find((c) => c.id === cuentaActivaId) : null;

  const handleLogout = () => {
    limpiarCuenta();
    logout();
    navigate(ROUTES.LOGIN);
  };
  const handleNavClick = () => {
    if (window.matchMedia('(max-width: 767px)').matches && !isCollapsed) collapse();
  };

  /** Renderiza un único NavItem */
  const renderItem = (to: string, label: string) => {
    const icon = ROUTE_ICONS[to] ?? 'dashboard';
    return (
      <NavLink
        key={to}
        to={to}
        end={to === ROUTES.ADMIN || to === ROUTES.DASHBOARD}
        title={isCollapsed ? label : undefined}
        onClick={handleNavClick}
        className={({ isActive }) =>
          [
            'group flex items-center rounded-md py-2 text-[13px] font-medium motion-safe-transition',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900',
            isCollapsed ? 'justify-center px-2.5' : 'gap-2.5 px-2.5',
            isActive
              ? 'bg-white/10 text-white'
              : 'text-slate-400 hover:bg-white/5 hover:text-slate-200',
          ].join(' ')
        }
      >
        {({ isActive }) => (
          <>
            <NavIcon
              name={icon}
              size={16}
              className={[
                'shrink-0 transition-colors',
                isActive
                  ? 'text-blue-400'
                  : 'text-slate-500 group-hover:text-slate-300',
              ].join(' ')}
            />
            {!isCollapsed && (
              <span className="truncate leading-none">{label}</span>
            )}
          </>
        )}
      </NavLink>
    );
  };

  return (
    <aside
      id="app-sidebar"
      aria-label="Navegación principal"
      className={[
        'sidebar-shell flex shrink-0 flex-col overflow-hidden',
        'transition-[width] duration-250 ease-in-out',
        'fixed bottom-0 left-0 top-14 z-30',
        'md:top-0 md:z-auto md:relative',
        isCollapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED,
      ].join(' ')}
    >
      {/* ── Cabecera ─────────────────────────── */}
      <div className={[
        'hidden shrink-0 items-center border-b border-white/8 md:flex',
        SIDEBAR_HEADER_HEIGHT_CLASS,
        isCollapsed ? 'flex-col justify-center gap-1 px-0 py-3' : 'gap-2.5 px-3',
      ].join(' ')}>
        <button
          type="button"
          onClick={toggle}
          title={isCollapsed ? 'Expandir' : 'Contraer menú'}
          aria-label={isCollapsed ? 'Expandir menú' : 'Contraer menú'}
          aria-expanded={!isCollapsed}
          aria-controls="app-sidebar"
          className="shrink-0 rounded-md p-1.5 text-slate-400 hover:bg-white/8 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 motion-safe-transition"
        >
          {/* Ícono de hamburguesa / colapso */}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>

        {!isCollapsed && (
          <Link
            to={homeRoute}
            onClick={handleNavClick}
            className="min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          >
            <span
              className="block truncate text-[13px] font-semibold tracking-tight text-white"
              translate="no"
            >
              {env.VITE_APP_NAME}
            </span>
            {isAdmin && (
              <span className="block truncate text-[10px] font-medium uppercase tracking-wider text-slate-500">
                Administrador
              </span>
            )}
          </Link>
        )}
      </div>

      {/* ── Navegación ───────────────────────── */}
      <nav
        className={[
          'clean-scroll flex flex-1 flex-col overflow-y-auto py-3',
          isCollapsed ? 'items-center gap-0.5 px-1.5' : 'gap-0.5 px-2',
        ].join(' ')}
        aria-label={isAdmin ? 'Administración' : 'Principal'}
      >
        {isAdmin && !isCollapsed ? (
          /* Admin: agrupado por sección */
          ADMIN_SECTIONS.map((section) => {
            const items = section.routes
              .map((route) => navItems.find((n) => n.to === route))
              .filter(Boolean) as { to: string; label: string }[];
            if (items.length === 0) return null;
            return (
              <div key={section.label} className="mb-4">
                <p className="mb-1 px-2.5 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
                  {section.label}
                </p>
                {items.map((item) => renderItem(item.to, item.label))}
              </div>
            );
          })
        ) : (
          /* Usuario / colapsado: lista plana */
          navItems.map((item) => renderItem(item.to, item.label))
        )}
      </nav>

      {/* ── Footer: usuario + logout ──────────── */}
      <div className={[
        'shrink-0 border-t border-white/8',
        isCollapsed ? 'flex flex-col items-center gap-1 p-2' : 'p-2',
      ].join(' ')}>
        {/* Info usuario */}
        {user && !isCollapsed && (
          <div className="mb-1 flex items-center gap-2.5 rounded-md px-2.5 py-2">
            <PerfilAvatar
              nombre={user.nombre}
              fotoPerfil={user.perfil?.fotoPerfil}
              size="sm"
            />
            <div className="min-w-0">
              <p className="truncate text-[13px] font-medium leading-tight text-white">
                {user.nombre}
              </p>
              {cuentaActiva && !isAdmin ? (
                <p className="truncate text-[11px] leading-tight text-emerald-400/80">
                  {cuentaActiva.nombre}
                </p>
              ) : (
                <p className="truncate text-[11px] capitalize leading-tight text-slate-500">
                  {user.rol}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Avatar colapsado */}
        {user && isCollapsed && (
          <div title={user.nombre}>
            <PerfilAvatar
              nombre={user.nombre}
              fotoPerfil={user.perfil?.fotoPerfil}
              size="sm"
              className="mb-1"
            />
          </div>
        )}

        {/* Cerrar sesión */}
        <button
          type="button"
          onClick={handleLogout}
          title={isCollapsed ? 'Cerrar sesión' : undefined}
          className={[
            'flex w-full items-center rounded-md py-2 text-[13px] font-medium text-slate-500',
            'motion-safe-transition hover:bg-white/5 hover:text-slate-300',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
            isCollapsed ? 'justify-center px-2.5' : 'gap-2.5 px-2.5',
          ].join(' ')}
          aria-label="Cerrar sesión"
        >
          <NavIcon name="logout" size={16} className="shrink-0" />
          {!isCollapsed && 'Cerrar sesión'}
        </button>
      </div>
    </aside>
  );
}
