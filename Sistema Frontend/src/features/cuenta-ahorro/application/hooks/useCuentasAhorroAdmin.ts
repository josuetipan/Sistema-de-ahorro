import { useCallback, useEffect, useState } from 'react';
import type {
  CrearCuentaAhorroInput,
  CuentaAhorroPublica,
  EmailSimulado,
  ResultadoCreacionCuenta,
  SocioResumen,
} from '../../domain/cuenta-ahorro.entity';
import { cuentaAhorroMockRepository } from '../../infrastructure/adapters/cuenta-ahorro-mock.adapter';
import type { ICuentaAhorroRepository } from '../../domain/cuenta-ahorro.repository';

interface UseCuentasAhorroAdminOptions {
  repository?: ICuentaAhorroRepository;
  socioId?: string;
}

export function useCuentasAhorroAdmin({
  repository = cuentaAhorroMockRepository,
  socioId,
}: UseCuentasAhorroAdminOptions = {}) {
  const [cuentas, setCuentas] = useState<CuentaAhorroPublica[]>([]);
  const [emails, setEmails] = useState<EmailSimulado[]>([]);
  const [cargando, setCargando] = useState(true);

  const recargar = useCallback(async () => {
    setCargando(true);
    try {
      const lista = socioId
        ? await repository.listarCuentasPorSocio(socioId)
        : await repository.listarCuentas();
      const correos = await repository.listarEmailsSimulados();
      setCuentas(lista);
      setEmails(correos);
    } finally {
      setCargando(false);
    }
  }, [repository, socioId]);

  useEffect(() => {
    void recargar();
  }, [recargar]);

  const buscarSocios = useCallback(
    (termino: string) => repository.buscarSocios(termino),
    [repository],
  );

  const crearCuenta = useCallback(
    async (input: CrearCuentaAhorroInput): Promise<ResultadoCreacionCuenta> => {
      const resultado = await repository.crearCuenta(input);
      await recargar();
      return resultado;
    },
    [repository, recargar],
  );

  return {
    cuentas,
    emails,
    cargando,
    buscarSocios,
    crearCuenta,
    recargar,
  };
}
