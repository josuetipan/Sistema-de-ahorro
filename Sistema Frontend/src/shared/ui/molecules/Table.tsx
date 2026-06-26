import type { ReactNode } from 'react';
import { EmptyState } from './EmptyState';

export interface TableColumn<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  numeric?: boolean;
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  emptyMessage?: string;
}

export function Table<T extends object>({
  columns,
  data,
  emptyMessage = 'No hay registros para mostrar.',
}: TableProps<T>) {
  if (data.length === 0) {
    return <EmptyState description={emptyMessage} />;
  }

  return (
    <div className="data-table-shell overflow-x-auto clean-scroll">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/80">
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={[
                  'whitespace-nowrap px-4 py-2.5 text-left text-xs font-semibold text-slate-500',
                  col.numeric ? 'tabular-nums text-right' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {data.map((row, i) => {
            const record = row as Record<string, unknown>;
            const rowKey = record.id ?? record.key ?? i;
            return (
              <tr
                key={String(rowKey)}
                className="motion-safe-transition hover:bg-blue-50/30"
              >
                {columns.map((col) => {
                  const isActions = col.key === 'acciones';
                  return (
                    <td
                      key={col.key}
                      className={[
                        'px-4 py-3 text-[13px] text-slate-700',
                        col.numeric
                          ? 'tabular-nums text-right font-medium text-slate-900'
                          : '',
                        isActions
                          ? 'min-w-[10rem] whitespace-normal'
                          : 'whitespace-nowrap',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                    >
                      {col.render ? col.render(row) : String(record[col.key] ?? '')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
