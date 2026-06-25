// Ruta protegida: redirige a login si no hay sesión
import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '@shared/hooks/useAuth';
import { ROUTES } from '@shared/config/routes';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location.pathname }} />;
  }

  return children;
}
