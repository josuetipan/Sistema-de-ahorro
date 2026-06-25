// Molécula: filtros segmentados tipo chip
export interface FilterChipOption<T extends string> {
  value: T;
  label: string;
  count?: number;
}

export interface FilterChipGroupProps<T extends string> {
  options: FilterChipOption<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel?: string;
}

export function FilterChipGroup<T extends string>({
  options,
  value,
  onChange,
  ariaLabel = 'Filtros',
}: FilterChipGroupProps<T>) {
  return (
    <div className="flex flex-wrap gap-1.5" role="group" aria-label={ariaLabel}>
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt.value)}
            className={[
              'touch-manipulation rounded-md px-3 py-1.5 text-[13px] font-medium motion-safe-transition',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1',
              active
                ? 'bg-blue-600 text-white shadow-sm'
                : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50',
            ].filter(Boolean).join(' ')}
          >
            {opt.label}
            {opt.count != null && (
              <span
                className={[
                  'ml-1.5 rounded-full px-1.5 py-0.5 text-xs tabular-nums',
                  active
                    ? 'bg-blue-500/70 text-white'
                    : 'bg-slate-100 text-slate-500',
                ].join(' ')}
              >
                {opt.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
