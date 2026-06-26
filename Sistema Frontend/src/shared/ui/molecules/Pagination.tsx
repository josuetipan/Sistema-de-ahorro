// Molécula: controles de paginación
import { Button } from '../atoms/Button';
import { NavIcon } from '../atoms/NavIcon';

export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav
      className="flex items-center justify-between gap-4"
      aria-label="Paginación"
    >
      <span className="text-[13px] tabular-nums text-slate-500">
        Página <span className="font-medium text-slate-700">{page}</span> de{' '}
        <span className="font-medium text-slate-700">{totalPages}</span>
      </span>

      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Página anterior"
          className="gap-1.5"
        >
          <NavIcon name="arrow-right" size={13} className="rotate-180" />
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Página siguiente"
          className="gap-1.5"
        >
          Siguiente
          <NavIcon name="arrow-right" size={13} />
        </Button>
      </div>
    </nav>
  );
}
