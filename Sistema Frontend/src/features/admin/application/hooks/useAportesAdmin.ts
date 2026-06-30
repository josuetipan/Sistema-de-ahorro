import { useCallback, useEffect, useState } from 'react';
import type { AporteMensualAdmin } from '@shared/data/adminMockData';
import {
  getAportesAdmin,
  type AportesAdminMeta,
  type ListarAportesAdminParams,
} from '../../infrastructure/api/admin-ahorro.api';

const EMPTY_META: AportesAdminMeta = {
  page: 1,
  limit: 0,
  total: 0,
  totalPages: 1,
};

export function useAportesAdmin(params: ListarAportesAdminParams) {
  const [aportes, setAportes] = useState<AporteMensualAdmin[]>([]);
  const [meta, setMeta] = useState<AportesAdminMeta>(EMPTY_META);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { estado, mes, page, limit } = params;

  const recargar = useCallback(async () => {
    setCargando(true);
    setError(null);

    try {
      const response = await getAportesAdmin({ estado, mes, page, limit });
      setAportes(response.data);
      setMeta(response.meta);
      return response;
    } catch {
      setError('No se pudieron cargar los aportes de ahorro.');
      setAportes([]);
      setMeta(EMPTY_META);
      return { data: [], meta: EMPTY_META };
    } finally {
      setCargando(false);
    }
  }, [estado, mes, page, limit]);

  useEffect(() => {
    void recargar();
  }, [recargar]);

  return { aportes, meta, cargando, error, recargar };
}
