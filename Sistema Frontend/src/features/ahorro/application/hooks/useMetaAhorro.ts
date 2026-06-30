import { useCallback, useEffect, useState } from 'react';
import type { ConfiguracionMetaAhorro } from '../../domain/ahorro.entity';
import { getMetaAhorroApi } from '../../infrastructure/api/ahorro.api';

export function useMetaAhorro() {
  const [meta, setMeta] = useState<ConfiguracionMetaAhorro | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const recargar = useCallback(async () => {
    setCargando(true);
    setError(null);

    try {
      const data = await getMetaAhorroApi();
      setMeta(data);
      return data;
    } catch {
      setError('No se pudo cargar la meta de ahorro.');
      return null;
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    void recargar();
  }, [recargar]);

  return { meta, cargando, error, recargar };
}
