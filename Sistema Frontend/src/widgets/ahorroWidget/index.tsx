import { Link } from 'react-router-dom';
import { formatCurrency } from '@shared/lib/formatters';
import { useCuentaActiva } from '@shared/hooks/useCuentaActiva';
import { ROUTES } from '@shared/config/routes';
import { usePagosAhorro } from '@features/ahorro/application/hooks/usePagosAhorro';

export function AhorroWidget() {
  const { cuentaActiva } = useCuentaActiva();
  const { resumen } = usePagosAhorro({ cuentaId: cuentaActiva?.id });

  if (!cuentaActiva) return null;

  const { saldoDisponible, progresoMes, metaMensual, progresoPorcentaje } = resumen;

  return (
    <div>
      <p className="text-2xl font-semibold tabular-nums text-gray-900">
        {formatCurrency(saldoDisponible)}
      </p>
      <p className="mt-0.5 text-pretty text-sm text-gray-500">
        saldo disponible en {cuentaActiva.nombre}
      </p>
      <div className="mt-4">
        <div className="mb-1.5 flex justify-between text-xs text-gray-500">
          <span>Meta mensual (verificado)</span>
          <span className="tabular-nums font-medium">{progresoPorcentaje}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-1.5 rounded-full bg-emerald-500 motion-safe-transition"
            style={{ width: `${progresoPorcentaje}%`, transitionProperty: 'width' }}
          />
        </div>
        <p className="mt-1 text-[11px] text-gray-500">
          {formatCurrency(progresoMes)} de {formatCurrency(metaMensual)}
        </p>
      </div>
      <Link to={ROUTES.MIS_AHORROS} className="link-btn-outline mt-4">
        Ver pagos
      </Link>
    </div>
  );
}
