import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { loginSchema, type LoginFormData } from '../../application/schemas/login.schema';
import { FormField } from '@shared/ui/molecules/FormField';
import { Input } from '@shared/ui/atoms/Input';
import { ActionButton } from '@shared/ui/atoms/ActionButton';
import { NavIcon } from '@shared/ui/atoms/NavIcon';
import { useToast } from '@shared/hooks/useToast';
import { ROUTES } from '@shared/config/routes';
import { isAxiosError } from 'axios';
import { useLogin } from '../hooks/useLogin';

function getAuthErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const msg = error.response?.data as { message?: string } | undefined;
    if (msg?.message) return `${msg.message} Verifica tus datos e inténtalo de nuevo.`;
    if (error.response?.status === 401) {
      return 'Correo o contraseña incorrectos. Verifica tus datos e inténtalo de nuevo.';
    }
  }
  return 'No se pudo completar la solicitud. Revisa tu conexión e inténtalo de nuevo.';
}

export function LoginForm() {
  const { login, isSubmitting } = useLogin();
  const toast = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
      toast.success('Sesión iniciada correctamente.');
    } catch (error) {
      toast.error(getAuthErrorMessage(error));
      setFocus('email');
    }
  };

  const onError = () => {
    const first = (['email', 'password'] as const).find((f) => errors[f]);
    if (first) setFocus(first);
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    toast.show('Contacta a soporte para recuperar tu contraseña (demo).', 'info');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-5" noValidate>
      <FormField label="Correo electrónico" htmlFor="email" error={errors.email?.message} required>
        <div className="relative">
          <NavIcon
            name="email"
            size={18}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <Input
            type="email"
            inputMode="email"
            autoComplete="email"
            spellCheck={false}
            placeholder="tu@correo.com"
            hasError={!!errors.email}
            className="pl-11"
            {...register('email')}
          />
        </div>
      </FormField>

      <FormField label="Contraseña" htmlFor="password" error={errors.password?.message} required>
        <div className="relative">
          <NavIcon
            name="lock"
            size={18}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <Input
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="••••••••"
            hasError={!!errors.password}
            className="pl-11 pr-11"
            {...register('password')}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 motion-safe-transition hover:bg-gray-100 hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            <NavIcon name={showPassword ? 'eye-off' : 'eye'} size={18} />
          </button>
        </div>
      </FormField>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          Recordarme
        </label>
        <a
          href="#recuperar"
          onClick={handleForgotPassword}
          className="text-sm font-medium text-blue-600 hover:text-blue-700 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          ¿Olvidaste tu contraseña?
        </a>
      </div>

      <ActionButton
        type="submit"
        fullWidth
        isLoading={isSubmitting}
        className="mt-2 flex-row-reverse gap-2.5"
        icon={
          !isSubmitting ? (
            <NavIcon name="arrow-right" size={18} className="text-white" />
          ) : undefined
        }
      >
        Iniciar Sesión
      </ActionButton>

      <p className="pt-2 text-center text-sm text-gray-600">
        ¿No tienes cuenta?{' '}
        <Link
          to={ROUTES.REGISTRO}
          className="font-semibold text-blue-600 hover:text-blue-700 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          Crear cuenta
        </Link>
      </p>
    </form>
  );
}
