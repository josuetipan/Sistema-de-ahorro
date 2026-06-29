import { useCallback, useEffect, useState } from 'react';
import { cuentaRepository } from '../../infrastructure/adapters';
import { obtenerCalendarioUseCase } from '../use-cases/obtener-calendario.usecase';
import type { CalendarioAhorro } from '../../domain/cuenta.entity';

interface UseCalendarioOptions {
  cuentaId?: string;
  anio: number;
}

export function useCalendario({ cuentaId, anio }: UseCalendarioOptions) {
  const [calendario, setCalendario] = useState<CalendarioAhorro | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recargar = useCallback(async () => {
    if (!cuentaId) {
      setCalendario(null);
      return;
    }
    setCargando(true);
    setError(null);
    try {
      const data = await obtenerCalendarioUseCase(cuentaRepository, cuentaId, anio);
      setCalendario(data);
    } catch {
      setCalendario(null);
      setError('No se pudo cargar el calendario de ahorro.');
    } finally {
      setCargando(false);
    }
  }, [cuentaId, anio]);

  useEffect(() => {
    void recargar();
  }, [recargar]);

  return { calendario, cargando, error, recargar };
}
