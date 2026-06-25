// Layout de autenticación Finnova — panel oscuro + panel claro con imágenes originales
import type { ReactNode } from 'react';
import { env } from '@shared/config/env';
import { NavIcon } from '@shared/ui/atoms/NavIcon';
import {
  finnovaFondoClaro,
  finnovaFondoOscuro,
  finnovaLogoPrincipal,
} from '@shared/assets/logos';

export interface AuthLayoutProps {
  children: ReactNode;
}

const BENEFITS = [
  { icon: 'shield'  as const, label: 'Seguro y confiable' },
  { icon: 'layers'  as const, label: 'Todo en un solo lugar' },
  { icon: 'zap'     as const, label: 'Ágil y fácil de usar' },
];

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <a href="#auth-main" className="skip-link">
        Ir al formulario
      </a>

      {/* ── Panel izquierdo — 40% desktop ── */}
      <aside
        className="relative hidden overflow-hidden lg:flex lg:w-[40%] lg:shrink-0 lg:flex-col"
        aria-label="Presentación Finnova"
      >
        {/* Imagen de fondo oscura */}
        <img
          src={finnovaFondoOscuro}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden
        />
        {/* Overlay para legibilidad */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-slate-950/85 via-blue-950/75 to-slate-900/90"
          aria-hidden
        />

        <div className="relative z-10 flex h-full flex-col p-10 xl:p-12">
          {/* Logo */}
          <div className="h-10 w-[220px] overflow-hidden xl:h-11 xl:w-[240px]">
            <img
              src={finnovaLogoPrincipal}
              alt="Finnova"
              className="h-[3.25rem] w-auto max-w-none object-left object-top xl:h-14"
            />
          </div>

          {/* Hero */}
          <div className="mt-8 max-w-md xl:mt-10">
            <h1 className="text-balance text-3xl font-semibold leading-tight tracking-tight text-white xl:text-4xl">
              Tu meta de ahorro,
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                mes a mes
              </span>
            </h1>
            <p className="mt-5 text-pretty text-sm leading-relaxed text-slate-300 xl:text-base">
              Registra tus aportes, sube comprobantes y sigue tu calendario de ahorro desde un solo lugar.
            </p>

            <ul className="mt-8 space-y-4">
              {BENEFITS.map(({ icon, label }) => (
                <li key={label} className="flex items-center gap-3 text-sm text-slate-200">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-blue-300 ring-1 ring-white/10 backdrop-blur-sm">
                    <NavIcon name={icon} size={18} />
                  </span>
                  {label}
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-auto pt-10 text-xs text-slate-500">
            © {new Date().getFullYear()} {env.VITE_APP_NAME}. Todos los derechos reservados.
          </p>
        </div>
      </aside>

      {/* ── Panel derecho — 60% desktop ── */}
      <div className="relative flex min-h-screen flex-1 flex-col lg:h-screen lg:overflow-y-auto lg:w-[60%]">
        {/* Imagen de fondo clara */}
        <img
          src={finnovaFondoClaro}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden
        />
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]" aria-hidden />

        <div className="relative z-10 flex flex-1 flex-col items-center px-5 py-10 sm:px-8 lg:px-12">
          <main id="auth-main" className="my-auto w-full max-w-md" tabIndex={-1}>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
