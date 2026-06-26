export interface BarChartItem {
  label: string;
  value: number;
}

export interface SimpleBarChartProps {
  data: BarChartItem[];
  valuePrefix?: string;
  valueSuffix?: string;
  colorClass?: string;
}

export function SimpleBarChart({
  data,
  valuePrefix = '',
  valueSuffix = '',
  colorClass = 'bg-gradient-to-t from-blue-600 to-blue-400',
}: SimpleBarChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="flex h-44 items-end justify-between gap-2 px-1 pt-3" role="img" aria-label="Gráfica de barras">
      {data.map((item) => {
        const height = Math.max((item.value / max) * 100, 4);
        return (
          <div key={item.label} className="flex min-w-0 flex-1 flex-col items-center gap-2">
            <span className="text-[10px] font-medium tabular-nums text-gray-500">
              {valuePrefix}
              {item.value.toLocaleString('es-MX')}
              {valueSuffix}
            </span>
            <div className="flex w-full flex-1 items-end">
              <div
                className={`mx-auto w-full max-w-[2.5rem] rounded-t-lg ${colorClass} motion-safe-transition`}
                style={{ height: `${height}%` }}
                title={`${item.label}: ${item.value}`}
              />
            </div>
            <span className="text-xs font-medium text-gray-600">{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}
