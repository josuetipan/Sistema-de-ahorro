import type { ReactNode } from 'react';
import { SearchBar } from '../molecules/SearchBar';
import { Table, type TableColumn, type TableProps } from '../molecules/Table';
import { Pagination } from '../molecules/Pagination';

export type { TableColumn };

export interface DataTableProps<T extends object> extends TableProps<T> {
  /** Barra de herramientas opcional (filtros, acciones secundarias). */
  toolbar?: ReactNode;
  search?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

/**
 * DataTable profesional: barra de herramientas + tabla + paginación.
 * No envuelve en SectionCard para evitar tarjetas dentro de tarjetas.
 */
export function DataTable<T extends object>({
  columns,
  data,
  emptyMessage,
  toolbar,
  search,
  onSearchChange,
  searchPlaceholder,
  page,
  totalPages,
  onPageChange,
}: DataTableProps<T>) {
  const hasSearch     = search != null && onSearchChange != null;
  const hasPagination = page != null && totalPages != null && onPageChange != null;
  const hasToolbar    = Boolean(toolbar || hasSearch);

  return (
    <div className="flex flex-col gap-4">
      {/* Barra de herramientas */}
      {hasToolbar && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {toolbar && <div className="flex flex-wrap items-center gap-2">{toolbar}</div>}
          {hasSearch && (
            <SearchBar
              value={search!}
              onChange={onSearchChange!}
              placeholder={searchPlaceholder}
              className="sm:w-64"
            />
          )}
        </div>
      )}

      {/* Tabla */}
      <Table columns={columns} data={data} emptyMessage={emptyMessage} />

      {/* Paginación */}
      {hasPagination && (
        <Pagination
          page={page!}
          totalPages={totalPages!}
          onPageChange={onPageChange!}
        />
      )}
    </div>
  );
}
