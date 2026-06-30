import { useCallback, useEffect, useState } from 'react';
import {
  getSociosAhorroAdmin,
  type AportesAdminMeta,
  type ListarSociosAdminParams,
  type SocioAhorroAdmin,
} from '../../infrastructure/api/admin-ahorro.api';

const EMPTY_META: AportesAdminMeta = {
  page: 1,
  limit: 0,
  total: 0,
  totalPages: 1,
};

export function useSociosAhorroAdmin(params: ListarSociosAdminParams) {
  const [socios, setSocios] = useState<SocioAhorroAdmin[]>([]);
  const [meta, setMeta] = useState<AportesAdminMeta>(EMPTY_META);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    page,
    limit,
    q,
    estado,
    codigo,
    nombre,
    email,
    identification,
    cuentaEstado,
  } = params;

  const recargar = useCallback(async () => {
    setCargando(true);
    setError(null);

    try {
      const response = await getSociosAhorroAdmin({
        page,
        limit,
        q,
        estado,
        codigo,
        nombre,
        email,
        identification,
        cuentaEstado,
      });
      setSocios(response.data);
      setMeta(response.meta);
      return response;
    } catch {
      setSocios([]);
      setMeta(EMPTY_META);
      setError('No se pudieron cargar los socios.');
      return { data: [], meta: EMPTY_META };
    } finally {
      setCargando(false);
    }
  }, [page, limit, q, estado, codigo, nombre, email, identification, cuentaEstado]);

  useEffect(() => {
    void recargar();
  }, [recargar]);

  return { socios, meta, cargando, error, recargar };
}
