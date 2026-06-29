import { useCallback, useState } from 'react';
import { cuentaRepository } from '../../infrastructure/adapters';
import { crearCuentaUseCase } from '../use-cases/crear-cuenta.usecase';
import type { CrearCuentaInput, CuentaCreada } from '../../domain/cuenta.entity';

export function useCrearCuenta() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const crearCuenta = useCallback(async (input: CrearCuentaInput): Promise<CuentaCreada> => {
    setIsSubmitting(true);
    try {
      return await crearCuentaUseCase(cuentaRepository, input);
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return { crearCuenta, isSubmitting };
}
