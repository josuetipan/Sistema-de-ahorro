import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { FormField } from '@shared/ui/molecules/FormField';
import { Input } from '@shared/ui/atoms/Input';
import { Button } from '@shared/ui/atoms/Button';
import { ROUTES } from '@shared/config/routes';
import {
  registroPublicoSocioSchema,
  type RegistroPublicoSocioFormData,
} from '../../application/schemas/registro-socio.schema';
import { CODIGOS_REFERENCIA_VALIDOS } from '../../infrastructure/data/socios.mock';
import type { ValidacionCodigoReferencia } from '../../domain/socio.entity';

interface SocioRegisterFormProps {
  onSubmit: (data: RegistroPublicoSocioFormData) => Promise<void>;
  isSubmitting: boolean;
  validarCodigoReferencia: (
    codigo: string,
    opciones?: { obligatorio?: boolean },
  ) => ValidacionCodigoReferencia;
}

export function SocioRegisterForm({
  onSubmit,
  isSubmitting,
  validarCodigoReferencia,
}: SocioRegisterFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    setFocus,
    formState: { errors },
  } = useForm<RegistroPublicoSocioFormData>({
    resolver: zodResolver(registroPublicoSocioSchema),
    defaultValues: {
      nombres: '',
      cedula: '',
      email: '',
      telefono: '',
      codigoReferenciaIngresado: '',
    },
  });

  const codigoIngresado = watch('codigoReferenciaIngresado');
  const validacionCodigo = codigoIngresado?.trim()
    ? validarCodigoReferencia(codigoIngresado, { obligatorio: true })
    : null;

  const handleCodigoBlur = () => {
    if (!codigoIngresado?.trim()) return;
    const validacion = validarCodigoReferencia(codigoIngresado, { obligatorio: true });
    if (!validacion.valido) {
      setError('codigoReferenciaIngresado', { message: validacion.error });
    } else {
      clearErrors('codigoReferenciaIngresado');
    }
  };

  const onValidSubmit = async (data: RegistroPublicoSocioFormData) => {
    const validacion = validarCodigoReferencia(data.codigoReferenciaIngresado, { obligatorio: true });
    if (!validacion.valido) {
      setError('codigoReferenciaIngresado', { message: validacion.error });
      setFocus('codigoReferenciaIngresado');
      return;
    }

    await onSubmit({
      ...data,
      codigoReferenciaIngresado: data.codigoReferenciaIngresado.trim().toUpperCase(),
    });
  };

  const onError = () => {
    const fields = ['nombres', 'cedula', 'email', 'telefono', 'codigoReferenciaIngresado'] as const;
    const first = fields.find((f) => errors[f]);
    if (first) setFocus(first);
  };

  return (
    <form onSubmit={handleSubmit(onValidSubmit, onError)} className="space-y-4" noValidate>
      <FormField label="Nombres completos" htmlFor="nombres" error={errors.nombres?.message} required>
        <Input
          type="text"
          autoComplete="name"
          placeholder="Juan Pérez…"
          hasError={!!errors.nombres}
          {...register('nombres')}
        />
      </FormField>

      <FormField label="Cédula" htmlFor="cedula" error={errors.cedula?.message} required>
        <Input
          type="text"
          inputMode="numeric"
          placeholder="1726312745"
          hasError={!!errors.cedula}
          {...register('cedula')}
        />
      </FormField>

      <FormField label="Correo" htmlFor="email" error={errors.email?.message} required>
        <Input
          type="email"
          inputMode="email"
          autoComplete="email"
          spellCheck={false}
          placeholder="juan@email.com"
          hasError={!!errors.email}
          {...register('email')}
        />
      </FormField>

      <FormField label="Teléfono" htmlFor="telefono" error={errors.telefono?.message} required>
        <Input
          type="tel"
          autoComplete="tel"
          placeholder="0999999999"
          hasError={!!errors.telefono}
          {...register('telefono')}
        />
      </FormField>

      <FormField
        label="Código de referencia"
        htmlFor="codigoReferenciaIngresado"
        error={errors.codigoReferenciaIngresado?.message}
        required
      >
        <Input
          type="text"
          placeholder="SOC-ABC123"
          hasError={!!errors.codigoReferenciaIngresado}
          {...register('codigoReferenciaIngresado', {
            onChange: (e) => {
              setValue('codigoReferenciaIngresado', e.target.value.toUpperCase(), {
                shouldValidate: true,
              });
            },
            onBlur: handleCodigoBlur,
          })}
        />
        {validacionCodigo?.valido && validacionCodigo.socioReferidor && (
          <p className="mt-1 text-[12px] text-green-700">
            Referido por:{' '}
            <span className="font-medium">{validacionCodigo.socioReferidor.nombres}</span>
          </p>
        )}
        <p className="mt-1 text-[11px] text-slate-500">
          Debes ingresar el código de un socio activo. Ejemplos válidos:{' '}
          {CODIGOS_REFERENCIA_VALIDOS.slice(0, 2).join(', ')}.
        </p>
      </FormField>

      <Button type="submit" fullWidth isLoading={isSubmitting}>
        Registrarme como socio
      </Button>

      <p className="text-center text-sm text-slate-600">
        ¿Ya tienes cuenta?{' '}
        <Link
          to={ROUTES.LOGIN}
          className="font-medium text-primary-600 hover:text-primary-700 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        >
          Iniciar sesión
        </Link>
      </p>
    </form>
  );
}
