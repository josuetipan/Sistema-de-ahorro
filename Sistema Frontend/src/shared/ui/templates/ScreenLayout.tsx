// Plantilla: contenedor estándar de pantalla (param-screen)
import type { ReactNode } from 'react';

export interface ScreenLayoutProps {
  children: ReactNode;
  mode?: 'content-aligned' | 'toolbar-full-bleed';
}

export function ScreenLayout({ children }: ScreenLayoutProps) {
  return (
    <div className="flex min-h-full flex-col">
      {children}
    </div>
  );
}
