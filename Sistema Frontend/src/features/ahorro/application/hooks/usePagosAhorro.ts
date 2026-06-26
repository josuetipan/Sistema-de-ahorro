import { useCallback, useEffect, useMemo, useState } from 'react';
import type { PagoAhorro, RegistrarPagoInput, ResumenAhorro } from '../../domain/pago.entity';
import { calcularResumenAhorro } from '../../domain/pago.rules';
import { subscribePagosAhorro } from '../../domain/pago.events';
import { pagoAhorroMockRepository } from '../../infrastructure/adapters/pago-ahorro-mock.adapter';
import type { IPagoAhorroRepository } from '../../domain/pago.repository';

interface UsePagosAhorroOptions {
  cuentaId?: string;
  repository?: IPagoAhorroRepository;
}

export function usePagosAhorro({
  cuentaId,
  repository = pagoAhorroMockRepository,
}: UsePagosAhorroOptions = {}) {
  const [pagos, setPagos] = useState<PagoAhorro[]>([]);
  const [cargando, setCargando] = useState(true);

  const recargar = useCallback(async () => {
    setCargando(true);
    try {
      const lista = cuentaId
        ? await repository.listarPorCuenta(cuentaId)
        : await repository.listarTodos();
      setPagos(lista);
    } finally {
      setCargando(false);
    }
  }, [cuentaId, repository]);

  useEffect(() => {
    void recargar();
    return subscribePagosAhorro(() => {
      void recargar();
    });
  }, [recargar]);

  const resumen: ResumenAhorro = useMemo(() => calcularResumenAhorro(pagos), [pagos]);

  const registrar = useCallback(
    async (input: RegistrarPagoInput) => {
      await repository.registrar(input);
      await recargar();
    },
    [repository, recargar],
  );

  const aprobar = useCallback(
    async (pagoId: string, contadorNombre: string) => {
      await repository.aprobar(pagoId, contadorNombre);
      await recargar();
    },
    [repository, recargar],
  );

  const rechazar = useCallback(
    async (pagoId: string, contadorNombre: string, motivo?: string) => {
      await repository.rechazar(pagoId, contadorNombre, motivo);
      await recargar();
    },
    [repository, recargar],
  );

  const pendientes = useMemo(
    () => pagos.filter((p) => p.estado === 'PENDIENTE_VERIFICACION'),
    [pagos],
  );

  return {
    pagos,
    resumen,
    pendientes,
    cargando,
    registrar,
    aprobar,
    rechazar,
    recargar,
  };
}
