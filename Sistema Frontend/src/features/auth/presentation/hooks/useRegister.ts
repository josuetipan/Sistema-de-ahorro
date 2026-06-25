import { useCallback, useState } from 'react';
import type { RegistroPublicoSocioFormData } from '@features/socio';
import {
  registrarSocioPublicoUseCase,
  socioMockRepository,
} from '@features/socio';
import { MOCK_TOKEN } from '../../infrastructure/mocks/auth.mock';
import { useAuthStore } from './useAuthStore';

export function useRegister() {
  const loginStore = useAuthStore((s) => s.login);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const register = useCallback(
    async (data: RegistroPublicoSocioFormData) => {
      setIsSubmitting(true);
      try {
        const socio = await registrarSocioPublicoUseCase(socioMockRepository, {
          nombres: data.nombres,
          cedula: data.cedula,
          email: data.email,
          telefono: data.telefono,
          codigoReferenciaIngresado: data.codigoReferenciaIngresado,
        });

        loginStore(
          {
            id: socio.id,
            email: socio.email,
            nombre: socio.nombres,
            rol: 'cliente',
            activo: true,
            createdAt: new Date().toISOString(),
            perfil: { telefono: socio.telefono },
          },
          MOCK_TOKEN,
        );

        return socio;
      } finally {
        setIsSubmitting(false);
      }
    },
    [loginStore],
  );

  return { register, isSubmitting };
}
