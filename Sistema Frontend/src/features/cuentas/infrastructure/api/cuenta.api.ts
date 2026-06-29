import { httpClient } from '@shared/lib/httpClient';
import { API_CONFIG } from '@shared/config/api';
import type {
  AporteDTO,
  AportesResponseBody,
  BackendEnvelope,
  CalendarioAhorroDTO,
  CrearCuentaRequest,
  CuentaCreadaDTO,
  InvitacionDTO,
  ResumenAhorroDTO,
} from '../dtos/cuenta.dto';
import type { ListarAportesParams } from '../../domain/cuenta.entity';

export async function getResumenAhorro(): Promise<ResumenAhorroDTO> {
  const { data } = await httpClient.get<ResumenAhorroDTO | BackendEnvelope<ResumenAhorroDTO>>(
    API_CONFIG.endpoints.ahorro.resumen,
  );
  // El backend envuelve la respuesta en { code, status, body }; algunos endpoints
  // pueden devolver el objeto directo, así que soportamos ambos formatos.
  return 'body' in data ? data.body : data;
}

export async function getAportes(params: ListarAportesParams): Promise<AportesResponseBody> {
  const { cuentaId, limit, page, desde, hasta } = params;
  const { data } = await httpClient.get<BackendEnvelope<AportesResponseBody> | AportesResponseBody>(
    API_CONFIG.endpoints.ahorro.aportes,
    { params: { cuentaId, limit, page, desde, hasta } },
  );
  return 'body' in data ? data.body : data;
}

export async function getMiInvitacion(): Promise<InvitacionDTO> {
  const { data } = await httpClient.get<BackendEnvelope<InvitacionDTO> | InvitacionDTO>(
    API_CONFIG.endpoints.ahorro.miInvitacion,
  );
  return 'body' in data ? data.body : data;
}

export async function getCalendario(
  cuentaId: string,
  anio: number,
): Promise<CalendarioAhorroDTO> {
  const { data } = await httpClient.get<BackendEnvelope<CalendarioAhorroDTO> | CalendarioAhorroDTO>(
    `${API_CONFIG.endpoints.ahorro.cuentas}/${cuentaId}/calendario`,
    { params: { anio } },
  );
  return 'body' in data ? data.body : data;
}

export async function postRegistrarAporte(
  cuentaId: string,
  formData: FormData,
): Promise<AporteDTO> {
  const { data } = await httpClient.post<BackendEnvelope<AporteDTO> | AporteDTO>(
    `${API_CONFIG.endpoints.ahorro.cuentas}/${cuentaId}/aportes`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return 'body' in data ? data.body : data;
}

export async function postCrearCuenta(payload: CrearCuentaRequest): Promise<CuentaCreadaDTO> {
  const { data } = await httpClient.post<BackendEnvelope<CuentaCreadaDTO>>(
    API_CONFIG.endpoints.ahorro.cuentas,
    payload,
  );
  return data.body;
}
