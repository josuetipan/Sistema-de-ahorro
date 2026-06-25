import { useCallback, useEffect, useState } from 'react';
import { consultarCreditosUseCase } from '../../application/use-cases/consultar-creditos.usecase';
import type { Credito } from '../../domain/credito.entity';
import { creditoRepository } from '../../infrastructure/adapters';

export function useConsultarCreditos() {
  const [creditos, setCreditos] = useState<Credito[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const cargar = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await consultarCreditosUseCase(creditoRepository);
      setCreditos(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  return { creditos, isLoading, recargar: cargar };
}
