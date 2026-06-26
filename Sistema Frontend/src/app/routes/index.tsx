// Definición de rutas de la aplicación con React Router v6
import type { ReactNode } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ROUTES } from '@shared/config/routes';
import { LoginPage } from '@/pages/login';
import { RegistroPage } from '@/pages/registro';
import { ElegirCuentaPage } from '@/pages/elegirCuenta';
import { DashboardPage } from '@/pages/dashboard';
import { MiCuentaPage } from '@/pages/miCuenta';
import { MisAhorrosPage } from '@/pages/misAhorros';
import { PagosPage } from '@/pages/pagos';
import { CalendarioPage } from '@/pages/calendario';
import { HistorialPage } from '@/pages/historial';
import { PerfilPage } from '@/pages/perfil';
import { AdminDashboardPage } from '@/pages/admin';
import { AdminSociosPage } from '@/pages/admin/socios';
import { AdminCuentasAhorroPage } from '@/pages/admin/cuentasAhorro';
import { AdminPagosPage } from '@/pages/admin/pagos';
import { AdminMovimientosPage } from '@/pages/admin/movimientos';
import { AdminReportesPage } from '@/pages/admin/reportes';
import { AdminUsuariosRolesPage } from '@/pages/admin/usuariosRoles';
import { AdminConfiguracionPage } from '@/pages/admin/configuracion';
import { ContadorVerificacionPage } from '@/pages/contador/verificacion';
import { ShowcasePage } from '@/pages/showcase';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleRoute } from './RoleRoute';
import { CuentaRequiredRoute } from './CuentaRequiredRoute';

function Protected({ children, path, requireCuenta = false }: {
  children: ReactNode;
  path: string;
  requireCuenta?: boolean;
}) {
  const content = requireCuenta ? (
    <CuentaRequiredRoute>{children}</CuentaRequiredRoute>
  ) : (
    children
  );

  return (
    <ProtectedRoute>
      <RoleRoute path={path}>{content}</RoleRoute>
    </ProtectedRoute>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.LOGIN} replace />} />
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.REGISTRO} element={<RegistroPage />} />
      <Route
        path={ROUTES.ELEGIR_CUENTA}
        element={
          <Protected path={ROUTES.ELEGIR_CUENTA}>
            <ElegirCuentaPage />
          </Protected>
        }
      />
      <Route
        path={ROUTES.DASHBOARD}
        element={
          <Protected path={ROUTES.DASHBOARD} requireCuenta>
            <DashboardPage />
          </Protected>
        }
      />
      <Route
        path={ROUTES.MI_CUENTA}
        element={
          <Protected path={ROUTES.MI_CUENTA} requireCuenta>
            <MiCuentaPage />
          </Protected>
        }
      />
      <Route
        path={ROUTES.MIS_AHORROS}
        element={
          <Protected path={ROUTES.MIS_AHORROS} requireCuenta>
            <MisAhorrosPage />
          </Protected>
        }
      />
      <Route
        path={ROUTES.PAGOS}
        element={
          <Protected path={ROUTES.PAGOS} requireCuenta>
            <PagosPage />
          </Protected>
        }
      />
      <Route
        path={ROUTES.CALENDARIO}
        element={
          <Protected path={ROUTES.CALENDARIO} requireCuenta>
            <CalendarioPage />
          </Protected>
        }
      />
      <Route
        path={ROUTES.INVITAR}
        element={<Navigate to={ROUTES.MI_CUENTA} replace />}
      />
      <Route
        path={ROUTES.HISTORIAL}
        element={
          <Protected path={ROUTES.HISTORIAL} requireCuenta>
            <HistorialPage />
          </Protected>
        }
      />
      <Route
        path={ROUTES.PERFIL}
        element={
          <Protected path={ROUTES.PERFIL}>
            <PerfilPage />
          </Protected>
        }
      />
      <Route
        path={ROUTES.ADMIN}
        element={
          <Protected path={ROUTES.ADMIN}>
            <AdminDashboardPage />
          </Protected>
        }
      />
      <Route
        path={ROUTES.ADMIN_SOCIOS}
        element={
          <Protected path={ROUTES.ADMIN_SOCIOS}>
            <AdminSociosPage />
          </Protected>
        }
      />
      <Route
        path={ROUTES.ADMIN_CUENTAS_AHORRO}
        element={
          <Protected path={ROUTES.ADMIN_CUENTAS_AHORRO}>
            <AdminCuentasAhorroPage />
          </Protected>
        }
      />
      <Route
        path={ROUTES.ADMIN_PAGOS}
        element={
          <Protected path={ROUTES.ADMIN_PAGOS}>
            <AdminPagosPage />
          </Protected>
        }
      />
      <Route
        path={ROUTES.ADMIN_MOVIMIENTOS}
        element={
          <Protected path={ROUTES.ADMIN_MOVIMIENTOS}>
            <AdminMovimientosPage />
          </Protected>
        }
      />
      <Route
        path={ROUTES.ADMIN_REPORTES}
        element={
          <Protected path={ROUTES.ADMIN_REPORTES}>
            <AdminReportesPage />
          </Protected>
        }
      />
      <Route
        path={ROUTES.ADMIN_USUARIOS_ROLES}
        element={
          <Protected path={ROUTES.ADMIN_USUARIOS_ROLES}>
            <AdminUsuariosRolesPage />
          </Protected>
        }
      />
      <Route
        path={ROUTES.ADMIN_CONFIGURACION}
        element={
          <Protected path={ROUTES.ADMIN_CONFIGURACION}>
            <AdminConfiguracionPage />
          </Protected>
        }
      />
      <Route
        path={ROUTES.CONTADOR_VERIFICACION}
        element={
          <Protected path={ROUTES.CONTADOR_VERIFICACION}>
            <ContadorVerificacionPage />
          </Protected>
        }
      />
      <Route
        path={ROUTES.SHOWCASE}
        element={
          <Protected path={ROUTES.SHOWCASE}>
            <ShowcasePage />
          </Protected>
        }
      />
      <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
    </Routes>
  );
}
