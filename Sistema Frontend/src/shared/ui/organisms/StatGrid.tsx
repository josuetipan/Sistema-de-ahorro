import { Children, cloneElement, isValidElement, type ReactNode } from 'react';
import { StatCard, type StatTone } from './StatCard';

const ROTATION: StatTone[] = ['blue', 'sky', 'mint', 'indigo', 'amber'];

export interface StatGridProps {
  children: ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

const colClasses: Record<NonNullable<StatGridProps['columns']>, string> = {
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4',
};

/**
 * Franja de métricas KPI.
 * — Contenedor único, sin tarjetas individuales
 * — Separador de 1px en slate-100 entre celdas
 * — Hover sutil por celda (definido en StatCard)
 */
export function StatGrid({ children, columns = 4, className = '' }: StatGridProps) {
  return (
    <div
      className={[
        'grid grid-cols-2 overflow-hidden rounded-xl border border-slate-200 bg-slate-100',
        'shadow-xs',
        colClasses[columns],
        className,
      ].join(' ')}
    >
      {Children.map(children, (child, index) => {
        if (isValidElement<{ tone?: StatTone; className?: string }>(child) && child.type === StatCard) {
          return cloneElement(child, {
            tone: child.props.tone ?? ROTATION[index % ROTATION.length],
            className: [child.props.className ?? '', 'bg-white'].filter(Boolean).join(' '),
          });
        }
        return child;
      })}
    </div>
  );
}
