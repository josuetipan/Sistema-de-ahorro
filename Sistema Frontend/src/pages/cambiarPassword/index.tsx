// Página de cambio de contraseña obligatorio (pending_password_reset)
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '@shared/ui/templates/AuthLayout';
import { AuthCard } from '@shared/ui/organisms/AuthCard';
import { ResetPasswordForm } from '@features/auth';
import { useAuth } from '@shared/hooks/useAuth';
import { getHomeRouteForRole } from '@shared/config/navigation';

export function CambiarPasswordPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const debeCambiar = Boolean(user?.pendingPasswordReset);

  useEffect(() => {
    if (user && !debeCambiar) {
      navigate(getHomeRouteForRole(user.rol), { replace: true });
    }
  }, [user, debeCambiar, navigate]);

  if (!debeCambiar) {
    return null;
  }

  return (
    <AuthLayout>
      <AuthCard
        title="Actualiza tu contraseña"
        subtitle="Por seguridad debes establecer una nueva contraseña antes de continuar."
      >
        <ResetPasswordForm />
      </AuthCard>
    </AuthLayout>
  );
}
