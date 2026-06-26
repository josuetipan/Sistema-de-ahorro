import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ActualizarSocioInput, CrearSocioInput, Socio } from '../../domain/socio.entity';
import { socioMockRepository } from '../../infrastructure/adapters/socio-mock.adapter';
import type { ISocioRepository } from '../../domain/socio.repository';

interface UseSociosOptions {
  repository?: ISocioRepository;
}

export function useSocios({ repository = socioMockRepository }: UseSociosOptions = {}) {
  const [socios, setSocios] = useState<Socio[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const recargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const lista = await repository.listar();
      setSocios(lista);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar los socios.');
    } finally {
      setCargando(false);
    }
  }, [repository]);

  useEffect(() => {
    void recargar();
  }, [recargar]);

  const crear = useCallback(
    async (input: CrearSocioInput) => {
      await repository.crear(input);
      await recargar();
    },
    [repository, recargar],
  );

  const actualizar = useCallback(
    async (id: string, input: ActualizarSocioInput) => {
      await repository.actualizar(id, input);
      await recargar();
    },
    [repository, recargar],
  );

  const cambiarEstado = useCallback(
    async (id: string, activo: boolean) => {
      await repository.cambiarEstado(id, activo);
      await recargar();
    },
    [repository, recargar],
  );

  const validarCodigoReferencia = useCallback(
    (codigo: string, opciones?: { excluirSocioId?: string; obligatorio?: boolean }) =>
      repository.validarCodigoReferencia(codigo, opciones),
    [repository],
  );

  const sociosPorId = useMemo(
    () => new Map(socios.map((socio) => [socio.id, socio])),
    [socios],
  );

  return {
    socios,
    sociosPorId,
    cargando,
    error,
    crear,
    actualizar,
    cambiarEstado,
    validarCodigoReferencia,
    recargar,
  };
}
