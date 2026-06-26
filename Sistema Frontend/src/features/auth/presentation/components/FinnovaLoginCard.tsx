import type { ReactNode } from 'react';
import {
  finnovaIcono,
  finnovaLogoPrincipal,
} from '@shared/assets/logos';

export interface FinnovaLoginCardProps {
  children: ReactNode;
}

export function FinnovaLoginCard({ children }: FinnovaLoginCardProps) {
  return (
    <div className="rounded-3xl border border-white/70 bg-white/80 p-8 shadow-[0_8px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-10">
      {/* Logo — solo visible en móvil (el panel izquierdo lo muestra en desktop) */}
      <img
        src={finnovaLogoPrincipal}
        alt="Finnova"
        className="mx-auto mb-6 h-8 w-auto object-contain lg:hidden"
      />

      {/* Ícono + encabezado */}
      <div className="mb-8 flex flex-col items-center text-center">
        
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
          Iniciar Sesión
        </h2>
        <p className="mt-2 text-pretty text-sm text-gray-500">
          Accede a tu cuenta de ahorro y crédito
        </p>
      </div>

      {children}
    </div>
  );
}
