// Redirige a elegir cuenta si el usuario no tiene una cuenta activa
import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { ROUTES } from '@shared/config/routes';
import { useCuentaActiva } from '@shared/hooks/useCuentaActiva';
import { useAuth } from '@shared/hooks/useAuth';
import { isAdminRole } from '@shared/config/navigation';

export function CuentaRequiredRoute({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { tieneCuentaSeleccionada } = useCuentaActiva();

  if (user && (isAdminRole(user.rol) || user.rol === 'contador')) {
    return children;
  }

  if (!tieneCuentaSeleccionada) {
    return <Navigate to={ROUTES.ELEGIR_CUENTA} replace />;
  }

  return children;
}
