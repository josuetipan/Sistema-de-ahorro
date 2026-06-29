import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from '../../application/schemas/reset-password.schema';
import { FormField } from '@shared/ui/molecules/FormField';
import { Input } from '@shared/ui/atoms/Input';
import { ActionButton } from '@shared/ui/atoms/ActionButton';
import { NavIcon } from '@shared/ui/atoms/NavIcon';
import { useToast } from '@shared/hooks/useToast';
import { useAuth } from '@shared/hooks/useAuth';
import { ROUTES } from '@shared/config/routes';
import { useResetPassword } from '../hooks/useResetPassword';

function getResetErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const msg = error.response?.data as { message?: string } | undefined;
    if (msg?.message) return msg.message;
    if (error.response?.status === 401 || error.response?.status === 400) {
      return 'La contraseña actual no es correcta. Verifica e inténtalo de nuevo.';
    }
  }
  if (error instanceof Error) return error.message;
  return 'No se pudo actualizar la contraseña. Revisa tu conexión e inténtalo de nuevo.';
}

type FieldName = 'currentPassword' | 'newPassword' | 'confirmPassword';

export function ResetPasswordForm() {
  const { resetPassword, isSubmitting } = useResetPassword();
  const { logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [visibles, setVisibles] = useState<Record<FieldName, boolean>>({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({ resolver: zodResolver(resetPasswordSchema) });

  const toggle = (field: FieldName) =>
    setVisibles((prev) => ({ ...prev, [field]: !prev[field] }));

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      const result = await resetPassword(data);
      toast.success(result.message || 'Contraseña actualizada correctamente.');
      logout();
      navigate(ROUTES.LOGIN, { replace: true });
    } catch (error) {
      toast.error(getResetErrorMessage(error));
      setFocus('currentPassword');
    }
  };

  const onError = () => {
    const order: FieldName[] = ['currentPassword', 'newPassword', 'confirmPassword'];
    const first = order.find((f) => errors[f]);
    if (first) setFocus(first);
  };

  const passwordField = (
    field: FieldName,
    label: string,
    placeholder: string,
    autoComplete: string,
  ) => (
    <FormField label={label} htmlFor={field} error={errors[field]?.message} required>
      <div className="relative">
        <NavIcon
          name="lock"
          size={18}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <Input
          id={field}
          type={visibles[field] ? 'text' : 'password'}
          autoComplete={autoComplete}
          placeholder={placeholder}
          hasError={!!errors[field]}
          className="pl-11 pr-11"
          {...register(field)}
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 motion-safe-transition hover:bg-gray-100 hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          onClick={() => toggle(field)}
          aria-label={visibles[field] ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        >
          <NavIcon name={visibles[field] ? 'eye-off' : 'eye'} size={18} />
        </button>
      </div>
    </FormField>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-5" noValidate>
      {passwordField('currentPassword', 'Contraseña actual', '••••••••', 'current-password')}
      {passwordField('newPassword', 'Nueva contraseña', '••••••••', 'new-password')}
      {passwordField('confirmPassword', 'Confirmar nueva contraseña', '••••••••', 'new-password')}

      <ActionButton
        type="submit"
        fullWidth
        isLoading={isSubmitting}
        className="mt-2 flex-row-reverse gap-2.5"
        icon={!isSubmitting ? <NavIcon name="arrow-right" size={18} className="text-white" /> : undefined}
      >
        Actualizar contraseña
      </ActionButton>
    </form>
  );
}
