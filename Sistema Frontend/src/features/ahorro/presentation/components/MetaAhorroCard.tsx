import { SectionCard } from '@shared/ui/molecules/SectionCard';
import { formatCurrency } from '@shared/lib/formatters';

export function MetaAhorroCard() {
  const meta = 20000;
  const actual = 15000;
  const pct = Math.round((actual / meta) * 100);

  return (
    <SectionCard title="Meta vacaciones" subtitle="Progreso de tu objetivo">
      <p className="tabular-nums text-2xl font-bold text-primary-600">{formatCurrency(actual)}</p>
      <p className="text-sm text-gray-500">de {formatCurrency(meta)}</p>
      <div className="mt-4">
        <div className="mb-1 flex justify-between text-sm">
          <span>Avance</span>
          <span className="tabular-nums font-medium">{pct}%</span>
        </div>
        <div
          className="h-2 rounded-full bg-gray-200"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-2 rounded-full bg-primary-600 motion-safe-transition"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </SectionCard>
  );
}
