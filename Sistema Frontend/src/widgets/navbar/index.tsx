// Widget: navbar móvil
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '@shared/config/routes';
import { env } from '@shared/config/env';
import { getHomeRouteForRole } from '@shared/config/navigation';
import { useAuth } from '@shared/hooks/useAuth';
import { useCuentaActivaStore } from '@shared/hooks/useCuentaActivaStore';
import { useSidebarStore } from '@shared/hooks/useSidebarStore';
import { Button } from '@shared/ui/atoms/Button';
import { NavIcon } from '@shared/ui/atoms/NavIcon';

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate   = useNavigate();
  const toggle     = useSidebarStore((s) => s.toggle);
  const isCollapsed = useSidebarStore((s) => s.isCollapsed);
  const limpiarCuenta = useCuentaActivaStore((s) => s.limpiarCuenta);
  const homeRoute  = user ? getHomeRouteForRole(user.rol) : ROUTES.DASHBOARD;

  const handleLogout = () => {
    limpiarCuenta();
    logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-900">
      <div className="flex h-14 items-center justify-between gap-3 px-4">
        {/* Izquierda: toggle + nombre */}
        <div className="flex min-w-0 items-center gap-2.5">
          {isAuthenticated && (
            <button
              type="button"
              onClick={toggle}
              aria-label={isCollapsed ? 'Expandir menú' : 'Contraer menú'}
              aria-expanded={!isCollapsed}
              aria-controls="app-sidebar"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-slate-400 hover:bg-white/8 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 motion-safe-transition"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          )}
          <Link
            to={homeRoute}
            className="min-w-0 truncate text-[13px] font-semibold text-white hover:text-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            translate="no"
          >
            {env.VITE_APP_NAME}
          </Link>
        </div>

        {/* Derecha: cambiar cuenta + logout */}
        <nav aria-label="Cuenta" className="shrink-0">
          {isAuthenticated ? (
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={handleLogout}
              className="h-8 w-8 p-0 text-slate-400 hover:bg-white/8 hover:text-white"
              aria-label="Cerrar sesión"
            >
              <NavIcon name="logout" size={15} aria-hidden />
            </Button>
          ) : (
            <Link
              to={ROUTES.LOGIN}
              className="inline-flex items-center rounded-md px-3 py-1.5 text-xs font-medium text-white ring-1 ring-white/15 hover:bg-white/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              Iniciar Sesión
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
