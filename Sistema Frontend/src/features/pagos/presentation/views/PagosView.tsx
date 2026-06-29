import { SectionCard } from '@shared/ui/molecules/SectionCard';
import { NavIcon } from '@shared/ui/atoms/NavIcon';
import { useCuentaActiva } from '@shared/hooks/useCuentaActiva';
import { PaymentUpload } from '@features/ahorro/presentation/components/PaymentUpload';

export function PagosView() {
  const { cuentaActiva } = useCuentaActiva();

  if (!cuentaActiva) return null;

  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col gap-4 lg:gap-6">
      <div className="rounded-xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50 to-teal-50/40 p-5">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/80 text-emerald-600 shadow-sm">
            <NavIcon name="account" size={20} />
          </span>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600">
              Cuenta activa
            </p>
            <p className="mt-0.5 truncate text-sm font-semibold text-slate-900">{cuentaActiva.nombre}</p>
            <p className="font-mono text-xs text-slate-500" translate="no">
              {cuentaActiva.numeroCuenta}
            </p>
          </div>
        </div>
      </div>

      <SectionCard
        title="Registrar aporte"
        subtitle="El aporte quedará pendiente hasta verificación del contador"
      >
        <PaymentUpload embedded cuentaId={cuentaActiva.id} />
      </SectionCard>
    </div>
  );
}
