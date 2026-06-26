// Ruta con control de acceso por rol
import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import type { Rol } from '@entities/usuario/model';
import { useAuth } from '@shared/hooks/useAuth';
import { ROUTES } from '@shared/config/routes';
import { canAccessRoute, getHomeRouteForRole } from '@shared/config/navigation';

interface RoleRouteProps {
  children: ReactNode;
  path: string;
  allowedRoles?: Rol[];
}

export function RoleRoute({ children, path, allowedRoles }: RoleRouteProps) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  const hasAccess = allowedRoles
    ? allowedRoles.includes(user.rol)
    : canAccessRoute(user.rol, path);

  if (!hasAccess) {
    return <Navigate to={getHomeRouteForRole(user.rol)} replace />;
  }

  return children;
}
