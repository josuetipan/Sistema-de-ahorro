import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { env } from '@shared/config/env';
import { ROUTES } from '@shared/config/routes';
import { useAuth } from '@shared/hooks/useAuth';
import { ActionButton } from '@shared/ui/atoms/ActionButton';
import { NavIcon } from '@shared/ui/atoms/NavIcon';
import { finnovaLogoPrincipal } from '@shared/assets/logos';
import { SIDEBAR_HEADER_HEIGHT_CLASS } from '@shared/ui/organisms/Sidebar';

export interface CuentaSelectionLayoutProps {
  children: ReactNode;
}

export function CuentaSelectionLayout({ children }: CuentaSelectionLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-slate-50">
      <header className={`w-full shrink-0 border-b border-white/8 bg-[#000B26] ${SIDEBAR_HEADER_HEIGHT_CLASS}`}>
        <div className="mx-auto flex h-full max-w-5xl items-center justify-between gap-4 px-5 md:px-8">
          <div className="flex min-w-0 items-center gap-3 text-left">
            <img src={finnovaLogoPrincipal} alt="Logo" className="h-7 w-auto brightness-0 invert" />
            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-white">{env.VITE_APP_NAME}</p>
              <p className="hidden truncate text-sm text-white/70 sm:block">Selecciona tu cuenta de ahorro</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            {user && (
              <span className="hidden text-sm text-white/70 md:block">
                Hola, <span className="font-medium text-white">{user.nombre}</span>
              </span>
            )}
            <ActionButton
              type="button"
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="h-8 border-white/25 bg-white/10 px-2.5 text-white hover:bg-white/20 hover:text-white"
            >
              <NavIcon name="logout" size={16} />
              <span className="hidden sm:inline">Salir</span>
            </ActionButton>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-8 md:px-8 md:py-10">
        {children}
      </main>
    </div>
  );
}
