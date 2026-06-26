// Página de registro de nuevo usuario
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '@shared/ui/templates/AuthLayout';
import { AuthCard } from '@shared/ui/organisms/AuthCard';
import { RegisterForm } from '@features/auth';
import { useAuth } from '@shared/hooks/useAuth';
import { getHomeRouteForRole } from '@shared/config/navigation';

export function RegistroPage() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(getHomeRouteForRole(user.rol), { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  if (isAuthenticated) {
    return null;
  }

  return (
    <AuthLayout>
      <AuthCard title="Registro de socio" subtitle="Únete a la cooperativa con un código de referencia válido">
        <RegisterForm />
      </AuthCard>
    </AuthLayout>
  );
}
