import { useCallback, useEffect, useState } from 'react';
import type {
  CrearSolicitudCuentaInput,
  SolicitudCuenta,
} from '../../domain/cuenta.entity';
import {
  getMisSolicitudes,
  postSolicitudCuenta,
} from '../../infrastructure/api/cuenta.api';

export function useSolicitudesCuenta() {
  const [solicitudes, setSolicitudes] = useState<SolicitudCuenta[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const recargar = useCallback(async () => {
    setCargando(true);
    setError(null);

    try {
      const data = await getMisSolicitudes();
      setSolicitudes(data);
      return data;
    } catch {
      setSolicitudes([]);
      setError('No se pudieron cargar tus solicitudes.');
      return [];
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    void recargar();
  }, [recargar]);

  const crear = useCallback(
    async (cuentaId: string, payload: CrearSolicitudCuentaInput) => {
      const solicitud = await postSolicitudCuenta(cuentaId, payload);
      await recargar();
      return solicitud;
    },
    [recargar],
  );

  return { solicitudes, cargando, error, crear, recargar };
}
