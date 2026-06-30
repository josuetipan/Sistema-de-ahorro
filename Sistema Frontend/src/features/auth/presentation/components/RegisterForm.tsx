import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Button } from '@shared/ui/atoms/Button';
import { Input } from '@shared/ui/atoms/Input';
import { FormField } from '@shared/ui/molecules/FormField';
import { ROUTES } from '@shared/config/routes';
import { useToast } from '@shared/hooks/useToast';
import {
  registerSchema,
  type RegisterFormData,
} from '../../application/schemas/login.schema';
import { useRegister } from '../hooks/useRegister';

export function RegisterForm() {
  const { register: registerUser, isSubmitting } = useRegister();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      identification: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const response = await registerUser(data);
      toast.success(`Perfil creado. Tu codigo de socio es ${response.socio.codigo}.`);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'No se pudo completar el registro. Verifica tus datos e intentalo de nuevo.',
      );
    }
  };

  const onError = () => {
    const fields = [
      'fullName',
      'identification',
      'email',
      'phoneNumber',
      'password',
      'confirmPassword',
    ] as const;
    const first = fields.find((field) => errors[field]);
    if (first) setFocus(first);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4" noValidate>
      <FormField label="Nombre completo" htmlFor="fullName" error={errors.fullName?.message} required>
        <Input
          type="text"
          autoComplete="name"
          placeholder="JOsue Tipan"
          hasError={!!errors.fullName}
          {...register('fullName')}
        />
      </FormField>

      <FormField label="Identificacion" htmlFor="identification" error={errors.identification?.message} required>
        <Input
          type="text"
          inputMode="numeric"
          placeholder="1754772779"
          hasError={!!errors.identification}
          {...register('identification')}
        />
      </FormField>

      <FormField label="Correo" htmlFor="email" error={errors.email?.message} required>
        <Input
          type="email"
          inputMode="email"
          autoComplete="email"
          spellCheck={false}
          placeholder="josue@finnova.local"
          hasError={!!errors.email}
          {...register('email')}
        />
      </FormField>

      <FormField label="Telefono" htmlFor="phoneNumber" error={errors.phoneNumber?.message} required>
        <Input
          type="tel"
          autoComplete="tel"
          placeholder="0983221332"
          hasError={!!errors.phoneNumber}
          {...register('phoneNumber')}
        />
      </FormField>

      <FormField label="Contrasena" htmlFor="password" error={errors.password?.message} required>
        <Input
          type="password"
          autoComplete="new-password"
          hasError={!!errors.password}
          {...register('password')}
        />
      </FormField>

      <FormField
        label="Confirmar contrasena"
        htmlFor="confirmPassword"
        error={errors.confirmPassword?.message}
        required
      >
        <Input
          type="password"
          autoComplete="new-password"
          hasError={!!errors.confirmPassword}
          {...register('confirmPassword')}
        />
      </FormField>

      <Button type="submit" fullWidth isLoading={isSubmitting}>
        Crear perfil
      </Button>

      <p className="text-center text-sm text-slate-600">
        Ya tienes cuenta?{' '}
        <Link
          to={ROUTES.LOGIN}
          className="font-medium text-primary-600 hover:text-primary-700 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        >
          Iniciar sesion
        </Link>
      </p>
    </form>
  );
}
