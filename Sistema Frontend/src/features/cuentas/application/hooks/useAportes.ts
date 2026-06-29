import { useCallback, useEffect, useState } from 'react';
import { cuentaRepository } from '../../infrastructure/adapters';
import { listarAportesUseCase } from '../use-cases/listar-aportes.usecase';
import type { Aporte } from '../../domain/cuenta.entity';

interface UseAportesOptions {
  cuentaId?: string;
  limit?: number;
  page?: number;
  desde?: string;
  hasta?: string;
}

export function useAportes({ cuentaId, limit = 10, page = 1, desde, hasta }: UseAportesOptions) {
  const [aportes, setAportes] = useState<Aporte[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recargar = useCallback(async () => {
    if (!cuentaId) {
      setAportes([]);
      setTotal(0);
      setTotalPages(0);
      return;
    }
    setCargando(true);
    setError(null);
    try {
      const result = await listarAportesUseCase(cuentaRepository, {
        cuentaId,
        limit,
        page,
        desde,
        hasta,
      });
      setAportes(result.data);
      setTotal(result.total);
      setTotalPages(result.totalPages);
    } catch {
      setError('No se pudieron cargar los pagos registrados.');
    } finally {
      setCargando(false);
    }
  }, [cuentaId, limit, page, desde, hasta]);

  useEffect(() => {
    void recargar();
  }, [recargar]);

  return { aportes, cargando, error, recargar, total, totalPages, page };
}
