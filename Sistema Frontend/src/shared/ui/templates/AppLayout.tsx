import type { ReactNode } from 'react';
import { Navbar } from '@/widgets/navbar';
import { Sidebar } from '@shared/ui/organisms/Sidebar';
import { useSidebarStore } from '@shared/hooks/useSidebarStore';

export interface AppLayoutProps {
  children: ReactNode;
}

/** Layout principal: sidebar colapsable + área de contenido */
export function AppLayout({ children }: AppLayoutProps) {
  const isCollapsed = useSidebarStore((s) => s.isCollapsed);
  const collapse    = useSidebarStore((s) => s.collapse);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-900">
      <a href="#main-content" className="skip-link">
        Ir al contenido principal
      </a>

      {/* Navbar — solo en móvil */}
      <div className="md:hidden">
        <Navbar />
      </div>

      {/* Overlay móvil cuando el sidebar está abierto */}
      {!isCollapsed && (
        <button
          type="button"
          className="fixed inset-0 top-14 z-20 bg-slate-950/60 backdrop-blur-[2px] md:hidden"
          onClick={collapse}
          aria-label="Cerrar menú"
        />
      )}

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <Sidebar />

        <main
          id="main-content"
          className="clean-scroll app-canvas flex min-w-0 flex-1 flex-col overflow-y-auto overflow-x-hidden"
          tabIndex={-1}
        >
          <div className="flex min-h-0 flex-1 flex-col">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
