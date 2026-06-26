import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ActionButton } from '@shared/ui/atoms/ActionButton';
import { Input } from '@shared/ui/atoms/Input';
import { NavIcon } from '@shared/ui/atoms/NavIcon';
import { SectionHeading } from '@shared/ui/molecules/SectionHeading';
import { useCuentaActiva } from '@shared/hooks/useCuentaActiva';
import { ROUTES } from '@shared/config/routes';
import { formatCurrency } from '@shared/lib/formatters';
import { PaymentList } from '@features/ahorro/presentation/components/PaymentList';
import { usePagosAhorro } from '@features/ahorro/application/hooks/usePagosAhorro';
import type { NavIconName } from '@shared/ui/atoms/NavIcon';

function fechaHoy(): string {
  return new Date().toISOString().split('T')[0];
}

const ACCESOS: { to: string; label: string; icon: NavIconName; destacado?: boolean }[] = [
  { to: ROUTES.PAGOS, label: 'Registrar pago', icon: 'upload', destacado: true },
  { to: ROUTES.CALENDARIO, label: 'Calendario', icon: 'chart' },
  { to: ROUTES.MI_CUENTA, label: 'Mi cuenta', icon: 'account' },
];

export function MisAhorrosView() {
  const { cuentaActiva } = useCuentaActiva();
  const { pagos, resumen, cargando } = usePagosAhorro({ cuentaId: cuentaActiva?.id });
  const [desde, setDesde] = useState(fechaHoy);
  const [hasta, setHasta] = useState(fechaHoy);
  const [filtrados, setFiltrados] = useState<typeof pagos | null>(null);

  const buscar = () => {
    if (!cuentaActiva) return;
    const resultado = pagos.filter((p) => {
      const fecha = new Date(p.fecha);
      const matchDesde = !desde || fecha >= new Date(desde);
      const matchHasta = !hasta || fecha <= new Date(`${hasta}T23:59:59`);
      return matchDesde && matchHasta;
    });
    setFiltrados(resultado);
  };

  if (!cuentaActiva) return null;

  const listaMostrar = filtrados ?? pagos;

  return (
    <div className="flex min-h-[calc(100dvh-10.5rem)] flex-col gap-3">
      <div className="shrink-0 rounded-xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50 to-white px-4 py-5">
        <div className="grid gap-4 text-center sm:grid-cols-4 sm:text-left">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600">Meta mensual</p>
            <p className="mt-1 text-xl font-bold tabular-nums text-slate-900">
              {formatCurrency(resumen.metaMensual)}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Progreso del mes</p>
            <p className="mt-1 text-xl font-bold tabular-nums text-emerald-700">
              {formatCurrency(resumen.progresoMes)}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Saldo disponible</p>
            <p className="mt-1 text-xl font-bold tabular-nums text-emerald-700">
              {formatCurrency(resumen.saldoDisponible)}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-600">Saldo pendiente</p>
            <p className="mt-1 text-xl font-bold tabular-nums text-amber-700">
              {formatCurrency(resumen.saldoPendiente)}
            </p>
          </div>
        </div>
        <p className="mt-3 text-center text-sm text-slate-600 sm:text-left">
          {cuentaActiva.nombre} · <span className="font-mono text-xs">{cuentaActiva.numeroCuenta}</span>
        </p>
      </div>

      <div className="flex shrink-0 justify-center overflow-x-auto rounded-xl border border-slate-200 bg-white px-3 py-3">
        <div className="flex items-end gap-2 sm:gap-3">
          {ACCESOS.map(({ to, label, icon, destacado }) => (
            <Link
              key={to}
              to={to}
              className={[
                'inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium motion-safe-transition sm:text-sm',
                destacado
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50',
              ].join(' ')}
            >
              <NavIcon name={icon} size={15} />
              <span className="whitespace-nowrap">{label}</span>
            </Link>
          ))}

          <div className="mx-1 h-8 w-px shrink-0 self-center bg-slate-200" aria-hidden />

          <div className="w-[118px] shrink-0 sm:w-[128px]">
            <label htmlFor="filtro-desde" className="mb-1 block text-[10px] font-medium text-slate-500">
              Desde
            </label>
            <Input type="date" id="filtro-desde" value={desde} onChange={(e) => setDesde(e.target.value)} className="w-full" />
          </div>
          <div className="w-[118px] shrink-0 sm:w-[128px]">
            <label htmlFor="filtro-hasta" className="mb-1 block text-[10px] font-medium text-slate-500">
              Hasta
            </label>
            <Input type="date" id="filtro-hasta" value={hasta} onChange={(e) => setHasta(e.target.value)} className="w-full" />
          </div>
          <ActionButton type="button" size="sm" onClick={buscar} className="shrink-0">
            <NavIcon name="search" size={14} />
            Buscar
          </ActionButton>
        </div>
      </div>

      <section className="flex min-h-0 flex-1 flex-col">
        <SectionHeading
          title={
            cargando
              ? 'Cargando pagos…'
              : filtrados === null
                ? 'Pagos registrados'
                : `Pagos · ${filtrados.length} registro(s)`
          }
        />
        <div className="min-h-0 flex-1 overflow-auto">
          <PaymentList
            pagos={listaMostrar}
            emptyMessage="No hay pagos en el rango seleccionado."
          />
        </div>
      </section>
    </div>
  );
}
