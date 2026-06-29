import { useState } from 'react';
import { cuentaRepository } from '../../infrastructure/adapters';
import { registrarAporteUseCase } from '../use-cases/registrar-aporte.usecase';
import type { Aporte, RegistrarAporteInput } from '../../domain/cuenta.entity';

export function useRegistrarAporte() {
  const [registrando, setRegistrando] = useState(false);

  const registrar = async (input: RegistrarAporteInput): Promise<Aporte> => {
    setRegistrando(true);
    try {
      return await registrarAporteUseCase(cuentaRepository, input);
    } finally {
      setRegistrando(false);
    }
  };

  return { registrar, registrando };
}
