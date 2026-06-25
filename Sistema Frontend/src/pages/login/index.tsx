// Página de inicio de sesión — Finnova
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthLayout } from '@shared/ui/templates/AuthLayout';
import { FinnovaLoginCard, LoginForm } from '@features/auth';
import { useAuth } from '@shared/hooks/useAuth';
import { canAccessRoute, getHomeRouteForRole } from '@shared/config/navigation';

export function LoginPage() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const fromState = (location.state as { from?: string } | null)?.from;

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const target =
      fromState && canAccessRoute(user.rol, fromState)
        ? fromState
        : getHomeRouteForRole(user.rol);

    navigate(target, { replace: true });
  }, [isAuthenticated, user, fromState, navigate]);

  if (isAuthenticated) {
    return null;
  }

  return (
    <AuthLayout>
      <FinnovaLoginCard>
        <LoginForm />
      </FinnovaLoginCard>
    </AuthLayout>
  );
}
