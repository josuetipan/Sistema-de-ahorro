import { useCallback, useEffect, useState } from 'react';
import {
  getSolicitudesCuentaAdmin,
  type AportesAdminMeta,
  type ListarSolicitudesCuentaAdminParams,
  type SolicitudCuentaAdmin,
} from '../../infrastructure/api/admin-ahorro.api';

const EMPTY_META: AportesAdminMeta = {
  page: 1,
  limit: 0,
  total: 0,
  totalPages: 1,
};

export function useSolicitudesCuentaAdmin(params: ListarSolicitudesCuentaAdminParams) {
  const [solicitudes, setSolicitudes] = useState<SolicitudCuentaAdmin[]>([]);
  const [meta, setMeta] = useState<AportesAdminMeta>(EMPTY_META);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { estado, tipo, page, limit } = params;

  const recargar = useCallback(async () => {
    setCargando(true);
    setError(null);

    try {
      const response = await getSolicitudesCuentaAdmin({ estado, tipo, page, limit });
      setSolicitudes(response.data);
      setMeta(response.meta);
      return response;
    } catch {
      setSolicitudes([]);
      setMeta(EMPTY_META);
      setError('No se pudieron cargar las solicitudes.');
      return { data: [], meta: EMPTY_META };
    } finally {
      setCargando(false);
    }
  }, [estado, tipo, page, limit]);

  useEffect(() => {
    void recargar();
  }, [recargar]);

  return { solicitudes, meta, cargando, error, recargar };
}
