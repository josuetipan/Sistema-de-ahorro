import type { HTMLAttributes } from 'react';
import { NavIcon, type NavIconName } from '@shared/ui/atoms/NavIcon';

export type StatTone = 'blue' | 'sky' | 'mint' | 'indigo' | 'amber';

export interface StatCardProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  tone?: StatTone;
  navIcon?: NavIconName;
  icon?: React.ReactNode;
}

const ICON_BG: Record<StatTone, string> = {
  blue:   'bg-blue-50   text-blue-600',
  sky:    'bg-sky-50    text-sky-600',
  mint:   'bg-emerald-50 text-emerald-600',
  indigo: 'bg-indigo-50  text-indigo-600',
  amber:  'bg-amber-50   text-amber-700',
};

const DEFAULT_ICON: Record<StatTone, NavIconName> = {
  blue:   'account',
  sky:    'chart',
  mint:   'savings',
  indigo: 'credits',
  amber:  'payments',
};

export function StatCard({
  label,
  value,
  trend,
  trendUp,
  tone = 'blue',
  navIcon,
  icon,
  className = '',
  ...props
}: StatCardProps) {
  const iconName = navIcon ?? DEFAULT_ICON[tone];
  const trendClass = trendUp != null
    ? trendUp ? 'text-emerald-600' : 'text-slate-400'
    : 'text-slate-400';

  return (
    <div
      className={[
        'flex flex-col gap-2 p-3 motion-safe-transition',
        'hover:bg-slate-50/60',
        className,
      ].join(' ')}
      {...props}
    >
      {/* Etiqueta + ícono */}
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] font-medium tracking-wide text-slate-500">{label}</p>
        <span
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded ${ICON_BG[tone]}`}
          aria-hidden
        >
          {icon ?? <NavIcon name={iconName} size={13} />}
        </span>
      </div>

      {/* Valor principal */}
      <p className="text-[20px] font-semibold tabular-nums leading-none tracking-tight text-slate-900">
        {value}
      </p>

      {/* Tendencia o espacio reservado */}
      {trend ? (
        <p className={`text-[11px] tabular-nums leading-tight ${trendClass}`}>{trend}</p>
      ) : (
        <span className="block h-[13px]" aria-hidden />
      )}
    </div>
  );
}
