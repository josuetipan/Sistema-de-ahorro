// Mi Cuenta — total ahorrado, datos y código de invitación
import { useState } from 'react';
import { StatusBadge } from '@shared/ui/molecules/StatusBadge';
import { SectionCard } from '@shared/ui/molecules/SectionCard';
import { NavIcon } from '@shared/ui/atoms/NavIcon';
import { formatCurrency } from '@shared/lib/formatters';
import { useCuentaActiva } from '@shared/hooks/useCuentaActiva';
import { useAuth } from '@shared/hooks/useAuth';
import { CambiarCuentaActions } from '@features/cuentas/presentation/components/CambiarCuentaActions';
import {
  AgregarCuentaButton,
  AgregarCuentaPanel,
} from '@features/cuentas/presentation/components/AgregarCuentaPanel';
import { InvitarCuentaSection } from '@features/invitaciones/presentation/components/InvitarCuentaSection';
import { usePagosAhorro } from '@features/ahorro/application/hooks/usePagosAhorro';
import { META_MENSUAL_OBLIGATORIA } from '@features/ahorro/domain/pago.entity';

export function MiCuentaView() {
  const { cuentaActiva } = useCuentaActiva();
  const { user } = useAuth();
  const { resumen } = usePagosAhorro({ cuentaId: cuentaActiva?.id });
  const [mostrarNuevaCuenta, setMostrarNuevaCuenta] = useState(false);

  if (!cuentaActiva) return null;

  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col gap-4 lg:gap-6">
      <div className="w-full rounded-xl border border-emerald-200/60 bg-gradient-to-r from-emerald-50 via-teal-50/50 to-emerald-50/30 p-5 lg:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
              Saldo disponible (verificado)
            </p>
            <p className="mt-1 text-3xl font-bold tabular-nums text-slate-900 lg:text-4xl">
              {formatCurrency(resumen.saldoDisponible)}
            </p>
            <p className="mt-2 text-sm text-amber-700">
              Pendiente de verificación: {formatCurrency(resumen.saldoPendiente)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Meta mensual: {formatCurrency(META_MENSUAL_OBLIGATORIA)} · Progreso:{' '}
              {formatCurrency(resumen.progresoMes)}
            </p>
          </div>

          <div className="flex flex-col gap-4 border-t border-emerald-200/50 pt-4 sm:flex-row sm:items-center lg:border-t-0 lg:border-l lg:pl-8 lg:pt-0">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/80 text-emerald-600 shadow-sm">
                <NavIcon name="account" size={20} />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">{cuentaActiva.nombre}</p>
                <p className="font-mono text-xs text-slate-500" translate="no">
                  {cuentaActiva.numeroCuenta}
                </p>
                <div className="mt-1">
                  <StatusBadge status="activa" label={cuentaActiva.estado} />
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <CambiarCuentaActions />
              <AgregarCuentaButton onClick={() => setMostrarNuevaCuenta(true)} />
            </div>
          </div>
        </div>
      </div>

      {mostrarNuevaCuenta && (
        <AgregarCuentaPanel onClose={() => setMostrarNuevaCuenta(false)} />
      )}

      <div className="grid w-full min-h-0 flex-1 gap-4 lg:grid-cols-2 lg:items-stretch lg:gap-6">
        <SectionCard title="Datos de la cuenta" className="h-full min-h-0">
          <dl className="divide-y divide-slate-100">
            <div className="flex items-center justify-between gap-4 py-2.5">
              <dt className="text-sm text-slate-500">Nombre</dt>
              <dd className="text-right text-sm font-medium text-slate-900">{cuentaActiva.nombre}</dd>
            </div>
            <div className="flex items-center justify-between gap-4 py-2.5">
              <dt className="text-sm text-slate-500">Número de cuenta</dt>
              <dd className="font-mono text-sm font-semibold text-slate-900" translate="no">
                {cuentaActiva.numeroCuenta}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4 py-2.5">
              <dt className="text-sm text-slate-500">Estado</dt>
              <dd>
                <StatusBadge status="activa" label={cuentaActiva.estado} />
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4 py-2.5">
              <dt className="text-sm text-slate-500">Fecha de apertura</dt>
              <dd className="text-sm text-slate-900">{cuentaActiva.fechaApertura}</dd>
            </div>
            <div className="flex items-center justify-between gap-4 py-2.5">
              <dt className="text-sm text-slate-500">Titular</dt>
              <dd className="text-sm text-slate-900">{user?.nombre ?? '—'}</dd>
            </div>
            <div className="flex items-center justify-between gap-4 py-2.5">
              <dt className="text-sm text-slate-500">Correo</dt>
              <dd className="text-sm text-slate-900">{user?.email ?? '—'}</dd>
            </div>
          </dl>
        </SectionCard>

        <InvitarCuentaSection className="h-full min-h-0" />
      </div>
    </div>
  );
}
