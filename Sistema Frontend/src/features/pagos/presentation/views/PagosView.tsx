import { SectionCard } from '@shared/ui/molecules/SectionCard';
import { NavIcon } from '@shared/ui/atoms/NavIcon';
import { useCuentaActiva } from '@shared/hooks/useCuentaActiva';
import { useAuth } from '@shared/hooks/useAuth';
import { PaymentUpload } from '@features/ahorro/presentation/components/PaymentUpload';
import { PaymentList } from '@features/ahorro/presentation/components/PaymentList';
import { usePagosAhorro } from '@features/ahorro/application/hooks/usePagosAhorro';
import { formatCurrency } from '@shared/lib/formatters';
import { META_MENSUAL_OBLIGATORIA } from '@features/ahorro/domain/pago.entity';

export function PagosView() {
  const { cuentaActiva } = useCuentaActiva();
  const { user } = useAuth();
  const { pagos, resumen, registrar, recargar } = usePagosAhorro({
    cuentaId: cuentaActiva?.id,
  });

  if (!cuentaActiva) return null;

  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col gap-4 lg:gap-6">
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50 to-teal-50/40 p-5 lg:col-span-1">
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

          <dl className="mt-4 space-y-3 border-t border-emerald-200/50 pt-4 text-sm">
            <div>
              <dt className="text-xs text-slate-500">Meta mensual</dt>
              <dd className="text-lg font-bold tabular-nums text-emerald-700">
                {formatCurrency(META_MENSUAL_OBLIGATORIA)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Progreso del mes (verificado)</dt>
              <dd className="font-semibold tabular-nums text-slate-800">
                {formatCurrency(resumen.progresoMes)} / {formatCurrency(resumen.metaMensual)}
              </dd>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <dt className="text-[10px] text-slate-500">Disponible</dt>
                <dd className="font-bold tabular-nums text-emerald-700">
                  {formatCurrency(resumen.saldoDisponible)}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] text-slate-500">Pendiente</dt>
                <dd className="font-bold tabular-nums text-amber-700">
                  {formatCurrency(resumen.saldoPendiente)}
                </dd>
              </div>
            </div>
          </dl>
        </div>

        <SectionCard
          title="Registrar pago"
          subtitle="El pago quedará pendiente hasta verificación del contador"
          className="lg:col-span-2"
        >
          <PaymentUpload
            embedded
            cuentaId={cuentaActiva.id}
            socioNombre={user?.nombre ?? 'Socio'}
            numeroCuenta={cuentaActiva.numeroCuenta}
            onRegistrar={async (input) => {
              await registrar(input);
              await recargar();
            }}
          />
        </SectionCard>
      </div>

      <SectionCard title="Historial de pagos" subtitle="Solo los verificados suman al saldo disponible">
        <PaymentList pagos={pagos} />
      </SectionCard>
    </div>
  );
}
