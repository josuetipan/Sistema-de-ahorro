import { useToast } from '@shared/hooks/useToast';
import {
  SocioRegisterForm,
  socioMockRepository,
  type RegistroPublicoSocioFormData,
} from '@features/socio';
import { useRegister } from '../hooks/useRegister';

export function RegisterForm() {
  const { register: registerSocio, isSubmitting } = useRegister();
  const toast = useToast();

  const onSubmit = async (data: RegistroPublicoSocioFormData) => {
    try {
      const socio = await registerSocio(data);
      toast.success(
        `Registro exitoso. Tu código de referencia es ${socio.codigoReferencia}.`,
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'No se pudo completar el registro. Verifica tus datos e inténtalo de nuevo.',
      );
    }
  };

  return (
    <SocioRegisterForm
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      validarCodigoReferencia={(codigo, opciones) =>
        socioMockRepository.validarCodigoReferencia(codigo, opciones)
      }
    />
  );
}

// Re-export para compatibilidad con imports existentes
export { SocioRegisterForm };
