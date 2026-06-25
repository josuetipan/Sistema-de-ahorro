import { SectionCard } from '@shared/ui/molecules/SectionCard';
import { formatCurrency } from '@shared/lib/formatters';

export interface SimuladorCreditoProps {
  monto: number;
  plazoMeses: number;
  cuota: number;
}

export function SimuladorCredito({ monto, plazoMeses, cuota }: SimuladorCreditoProps) {
  const totalPagar = cuota * plazoMeses;
  const intereses = totalPagar - monto;

  return (
    <SectionCard title="Simulación de cuotas" subtitle="Estimación con tasa anual del 18%">
      <dl className="space-y-3">
        <div className="flex justify-between text-sm">
          <dt className="text-gray-500">Monto solicitado</dt>
          <dd className="tabular-nums font-medium">{formatCurrency(monto)}</dd>
        </div>
        <div className="flex justify-between text-sm">
          <dt className="text-gray-500">Plazo</dt>
          <dd className="font-medium">{plazoMeses} meses</dd>
        </div>
        <div className="flex justify-between border-t border-gray-100 pt-3">
          <dt className="font-medium text-gray-900">Cuota mensual estimada</dt>
          <dd className="tabular-nums text-lg font-bold text-primary-600">{formatCurrency(cuota)}</dd>
        </div>
        <div className="flex justify-between text-sm">
          <dt className="text-gray-500">Total a pagar</dt>
          <dd className="tabular-nums">{formatCurrency(totalPagar)}</dd>
        </div>
        <div className="flex justify-between text-sm">
          <dt className="text-gray-500">Intereses estimados</dt>
          <dd className="tabular-nums text-gray-600">{formatCurrency(Math.max(0, intereses))}</dd>
        </div>
      </dl>
      <p className="mt-4 text-xs text-gray-400">
        Simulación referencial. La cuota final puede variar según evaluación crediticia.
      </p>
    </SectionCard>
  );
}
