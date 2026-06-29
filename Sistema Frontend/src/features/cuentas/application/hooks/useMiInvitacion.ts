import { useCallback, useEffect, useState } from 'react';
import { cuentaRepository } from '../../infrastructure/adapters';
import { obtenerMiInvitacionUseCase } from '../use-cases/obtener-mi-invitacion.usecase';
import type { Invitacion } from '../../domain/cuenta.entity';

export function useMiInvitacion() {
  const [invitacion, setInvitacion] = useState<Invitacion | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const recargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const data = await obtenerMiInvitacionUseCase(cuentaRepository);
      setInvitacion(data);
    } catch {
      setInvitacion(null);
      setError('No se pudo cargar tu código de invitación.');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    void recargar();
  }, [recargar]);

  return { invitacion, cargando, error, recargar };
}
