// Hook para gestionar estado de paginación en listados
import { useCallback, useState } from 'react';
import { PAGINATION } from '@shared/lib/constants';

export function usePagination(
  initialPage: number = PAGINATION.DEFAULT_PAGE,
  initialPageSize: number = PAGINATION.DEFAULT_PAGE_SIZE,
) {
  const [page, setPage] = useState<number>(initialPage);
  const [pageSize, setPageSize] = useState<number>(initialPageSize);

  const nextPage = useCallback(() => setPage((p) => p + 1), []);
  const prevPage = useCallback(() => setPage((p) => Math.max(1, p - 1)), []);
  const goToPage = useCallback((p: number) => setPage(Math.max(1, p)), []);
  const reset = useCallback(() => {
    setPage(initialPage);
    setPageSize(initialPageSize);
  }, [initialPage, initialPageSize]);

  return { page, pageSize, setPage, setPageSize, nextPage, prevPage, goToPage, reset };
}
