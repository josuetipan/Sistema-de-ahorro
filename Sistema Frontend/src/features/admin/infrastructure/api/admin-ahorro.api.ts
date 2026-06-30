import { httpClient } from '@shared/lib/httpClient';
import { API_CONFIG } from '@shared/config/api';
import type {
  AporteMensualAdmin,
  EstadoAporteMensualAdmin,
} from '@shared/data/adminMockData';
import type { ConfiguracionMetaAhorro } from '@features/ahorro/domain/ahorro.entity';

interface BackendEnvelope<T> {
  code: number;
  status: string;
  body: T;
}

export interface AportesAdminMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AportesAdminResponse {
  data: AporteMensualAdmin[];
  meta: AportesAdminMeta;
}

export type EstadoSocioAdmin = 'activo' | 'inactivo' | 'pendiente';
export type EstadoCuentaAhorroAdmin = 'activa' | 'cerrada' | 'inactiva' | 'bloqueada';

export interface CuentaSocioAdmin {
  idCuenta: string;
  numeroCuenta: string;
  nombre: string;
  tipo: string;
  estado: EstadoCuentaAhorroAdmin;
  moneda: string;
  saldo: number;
  saldoDisponible: number;
  totalAhorrado: number;
  totalDepositos: number;
  totalRetiros: number;
  color: string;
  icono: string;
  fechaApertura: string;
}

export interface SocioAhorroAdmin {
  idSocio: string;
  codigo: string;
  estado: EstadoSocioAdmin;
  userId: string;
  fullName: string;
  email: string;
  identification: string;
  phoneNumber: string;
  totalAhorrado: number;
  cantidadCuentas: number;
  cuentas: CuentaSocioAdmin[];
}

export interface SociosAdminResponse {
  data: SocioAhorroAdmin[];
  meta: AportesAdminMeta;
}

export type EstadoSolicitudCuentaAdmin = 'pendiente' | 'aprobada' | 'rechazada';
export type TipoSolicitudCuentaAdmin = 'retiro' | 'eliminacion';

export interface SolicitudCuentaAdmin {
  idSolicitudCuenta: string;
  cuentaOrigenId: string;
  cuentaDestinoId: string | null;
  tipo: TipoSolicitudCuentaAdmin;
  monto: number | null;
  motivo: string;
  estado: EstadoSolicitudCuentaAdmin;
  observaciones: string | null;
  resueltoPor: string | null;
  fechaResolucion: string | null;
  createdAt: string;
  numeroCuentaOrigen: string;
  socioId: string;
  socioNombre: string;
}

export interface SolicitudesCuentaAdminResponse {
  data: SolicitudCuentaAdmin[];
  meta: AportesAdminMeta;
}

export interface ComprobanteAporteAdmin {
  idAporteMensual: string;
  cuentaId: string;
  comprobante: string;
  archivoNombre: string;
  urlArchivo: string;
}

type AportesBody = AporteMensualAdmin[] | AportesAdminResponse;
type SociosBody = SocioAhorroAdmin[] | SociosAdminResponse;
type SolicitudesBody = SolicitudCuentaAdmin[] | SolicitudesCuentaAdminResponse;

export interface ListarAportesAdminParams {
  estado?: AporteMensualAdmin['estado'];
  mes?: string;
  page?: number;
  limit?: number;
}

export interface ListarSociosAdminParams {
  page?: number;
  limit?: number;
  q?: string;
  estado?: EstadoSocioAdmin | '';
  codigo?: string;
  nombre?: string;
  email?: string;
  identification?: string;
  cuentaEstado?: EstadoCuentaAhorroAdmin | '';
}

export interface ListarSolicitudesCuentaAdminParams {
  estado?: EstadoSolicitudCuentaAdmin | '';
  tipo?: TipoSolicitudCuentaAdmin | '';
  page?: number;
  limit?: number;
}

export interface CambiarEstadoAporteAdminPayload {
  estado: Exclude<EstadoAporteMensualAdmin, 'pendiente'>;
  observaciones: string;
}

export interface ActualizarMetaAhorroAdminPayload {
  metaMensual: number;
  metaMinima: number;
  metaMaxima: number;
}

export interface ResolverSolicitudCuentaAdminPayload {
  aprobar: boolean;
  observaciones: string;
}

function unwrapAportes(data: BackendEnvelope<AportesBody> | AportesBody): AportesAdminResponse {
  const body = data && typeof data === 'object' && 'body' in data ? data.body : data;

  if (Array.isArray(body)) {
    return {
      data: body,
      meta: {
        page: 1,
        limit: body.length,
        total: body.length,
        totalPages: 1,
      },
    };
  }

  if (body && typeof body === 'object') {
    return {
      data: Array.isArray(body.data) ? body.data : [],
      meta: body.meta ?? {
        page: 1,
        limit: Array.isArray(body.data) ? body.data.length : 0,
        total: Array.isArray(body.data) ? body.data.length : 0,
        totalPages: 1,
      },
    };
  }

  return {
    data: [],
    meta: {
      page: 1,
      limit: 0,
      total: 0,
      totalPages: 1,
    },
  };
}

function unwrapSocios(data: BackendEnvelope<SociosBody> | SociosBody): SociosAdminResponse {
  const body = data && typeof data === 'object' && 'body' in data ? data.body : data;

  if (Array.isArray(body)) {
    return {
      data: body,
      meta: {
        page: 1,
        limit: body.length,
        total: body.length,
        totalPages: 1,
      },
    };
  }

  if (body && typeof body === 'object') {
    return {
      data: Array.isArray(body.data) ? body.data : [],
      meta: body.meta ?? {
        page: 1,
        limit: Array.isArray(body.data) ? body.data.length : 0,
        total: Array.isArray(body.data) ? body.data.length : 0,
        totalPages: 1,
      },
    };
  }

  return {
    data: [],
    meta: {
      page: 1,
      limit: 0,
      total: 0,
      totalPages: 1,
    },
  };
}

function unwrapSolicitudes(
  data: BackendEnvelope<SolicitudesBody> | SolicitudesBody,
): SolicitudesCuentaAdminResponse {
  const body = data && typeof data === 'object' && 'body' in data ? data.body : data;

  if (Array.isArray(body)) {
    return {
      data: body,
      meta: {
        page: 1,
        limit: body.length,
        total: body.length,
        totalPages: 1,
      },
    };
  }

  if (body && typeof body === 'object') {
    return {
      data: Array.isArray(body.data) ? body.data : [],
      meta: body.meta ?? {
        page: 1,
        limit: Array.isArray(body.data) ? body.data.length : 0,
        total: Array.isArray(body.data) ? body.data.length : 0,
        totalPages: 1,
      },
    };
  }

  return {
    data: [],
    meta: {
      page: 1,
      limit: 0,
      total: 0,
      totalPages: 1,
    },
  };
}

export async function getAportesAdmin(
  params: ListarAportesAdminParams,
): Promise<AportesAdminResponse> {
  const { data } = await httpClient.get<BackendEnvelope<AportesBody> | AportesBody>(
    API_CONFIG.endpoints.admin.ahorro.aportes,
    { params },
  );

  return unwrapAportes(data);
}

export async function getSociosAhorroAdmin(
  params: ListarSociosAdminParams,
): Promise<SociosAdminResponse> {
  const { data } = await httpClient.get<BackendEnvelope<SociosBody> | SociosBody>(
    API_CONFIG.endpoints.admin.ahorro.socios,
    { params },
  );

  return unwrapSocios(data);
}

export async function getSolicitudesCuentaAdmin(
  params: ListarSolicitudesCuentaAdminParams,
): Promise<SolicitudesCuentaAdminResponse> {
  const { data } = await httpClient.get<BackendEnvelope<SolicitudesBody> | SolicitudesBody>(
    API_CONFIG.endpoints.admin.ahorro.solicitudes,
    { params },
  );

  return unwrapSolicitudes(data);
}

export async function patchResolverSolicitudCuentaAdmin(
  solicitudId: string,
  payload: ResolverSolicitudCuentaAdminPayload,
): Promise<SolicitudCuentaAdmin> {
  const { data } = await httpClient.patch<BackendEnvelope<SolicitudCuentaAdmin> | SolicitudCuentaAdmin>(
    `${API_CONFIG.endpoints.admin.ahorro.solicitudes}/${solicitudId}/resolver`,
    payload,
  );

  return data && typeof data === 'object' && 'body' in data ? data.body : data;
}

export async function getComprobanteAporteAdmin(
  aporteId: string,
): Promise<ComprobanteAporteAdmin> {
  const { data } = await httpClient.get<
    BackendEnvelope<ComprobanteAporteAdmin> | ComprobanteAporteAdmin
  >(`${API_CONFIG.endpoints.admin.ahorro.aportes}/${aporteId}/comprobante`);

  return data && typeof data === 'object' && 'body' in data ? data.body : data;
}

export async function patchEstadoAporteAdmin(
  aporteId: string,
  payload: CambiarEstadoAporteAdminPayload,
): Promise<void> {
  await httpClient.patch(
    `${API_CONFIG.endpoints.admin.ahorro.aportes}/${aporteId}/estado`,
    payload,
  );
}

export async function getMetaAhorroAdmin(): Promise<ConfiguracionMetaAhorro> {
  const { data } = await httpClient.get<
    BackendEnvelope<ConfiguracionMetaAhorro> | ConfiguracionMetaAhorro
  >(API_CONFIG.endpoints.admin.ahorro.meta);

  return data && typeof data === 'object' && 'body' in data ? data.body : data;
}

export async function patchMetaAhorroAdmin(
  payload: ActualizarMetaAhorroAdminPayload,
): Promise<ConfiguracionMetaAhorro> {
  const { data } = await httpClient.patch<
    BackendEnvelope<ConfiguracionMetaAhorro> | ConfiguracionMetaAhorro
  >(API_CONFIG.endpoints.admin.ahorro.meta, payload);

  return data && typeof data === 'object' && 'body' in data ? data.body : data;
}
