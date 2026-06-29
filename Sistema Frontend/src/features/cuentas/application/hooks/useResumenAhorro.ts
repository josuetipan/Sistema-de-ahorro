import { useCallback, useEffect, useState } from 'react';
import { cuentaRepository } from '../../infrastructure/adapters';
import { obtenerResumenAhorroUseCase } from '../use-cases/obtener-resumen.usecase';
import type { ResumenAhorroGlobal } from '../../domain/cuenta.entity';

export function useResumenAhorro() {
  const [resumen, setResumen] = useState<ResumenAhorroGlobal | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const recargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const data = await obtenerResumenAhorroUseCase(cuentaRepository);
      setResumen(data);
      return data;
    } catch {
      setError('No se pudieron cargar tus cuentas de ahorro.');
      return null;
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    void recargar();
  }, [recargar]);

  return { resumen, cuentas: resumen?.cuentas ?? [], cargando, error, recargar };
}
