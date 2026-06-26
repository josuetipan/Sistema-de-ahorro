// Organismo: contenedor de gráficos para reportes y dashboard
import type { ReactNode } from 'react';
import { Card } from '../molecules/Card';

export interface ChartProps {
  title: string;
  children?: ReactNode;
}

export function Chart({ title, children }: ChartProps) {
  return (
    <Card title={title}>
      <div
        className="flex h-64 items-center justify-center rounded-lg bg-gray-50 text-gray-400 motion-safe-transition"
        role="img"
        aria-label="Gráfico de movimientos — pendiente de integrar librería de charts"
      >
        {children ?? 'Gráfico pendiente de integrar…'}
      </div>
    </Card>
  );
}
