import { httpClient } from '@shared/lib/httpClient';
import { API_CONFIG } from '@shared/config/api';
import type { BackendEnvelope } from '@features/auth/infrastructure/dtos/auth.dto';
import type { IPagoAhorroRepository } from '../../domain/pago.repository';
import type { PagoAhorro, RegistrarPagoInput } from '../../domain/pago.entity';

interface BackendAporte {
  idAporteMensual: string;
  cuentaId: string;
  mes: string;
  monto: number;
  comprobante: string;
  urlArchivo: string;
  archivoNombre: string | null;
  estado: 'pendiente' | 'verificado' | 'rechazado';
  fechaRegistro: string;
  numeroCuenta: string;
  socioNombre: string;
}

interface PaginatedAportes {
  data: BackendAporte[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

function unwrap<T>(data: BackendEnvelope<T> | T): T {
  return data && typeof data === 'object' && 'body' in data ? data.body : data;
}

function mapAporte(aporte: BackendAporte): PagoAhorro {
  return {
    id: aporte.idAporteMensual,
    cuentaId: aporte.cuentaId,
    socioNombre: aporte.socioNombre,
    numeroCuenta: aporte.numeroCuenta,
    monto: aporte.monto,
    fecha: aporte.fechaRegistro,
    mes: aporte.mes,
    comprobante: aporte.comprobante,
    comprobanteUrl: aporte.urlArchivo,
    archivoNombre: aporte.archivoNombre ?? undefined,
    estado: aporte.estado === 'pendiente'
      ? 'PENDIENTE_VERIFICACION'
      : aporte.estado === 'verificado' ? 'VERIFICADO' : 'RECHAZADO',
  };
}

export class PagoAhorroHttpAdapter implements IPagoAhorroRepository {
  async listarPorCuenta(cuentaId: string): Promise<PagoAhorro[]> {
    const { data } = await httpClient.get<BackendEnvelope<PaginatedAportes> | PaginatedAportes>(
      API_CONFIG.endpoints.ahorro.aportes,
      { params: { cuentaId, page: 1, limit: 100 } },
    );
    return unwrap(data).data.map(mapAporte);
  }

  async listarTodos(): Promise<PagoAhorro[]> {
    const { data } = await httpClient.get<BackendEnvelope<PaginatedAportes> | PaginatedAportes>(
      API_CONFIG.endpoints.contador.aportes,
      { params: { estado: 'pendiente', page: 1, limit: 100 } },
    );
    return unwrap(data).data.map(mapAporte);
  }

  async listarPendientes(): Promise<PagoAhorro[]> {
    return this.listarTodos();
  }

  async registrar(_input: RegistrarPagoInput): Promise<PagoAhorro> {
    throw new Error('El registro de aportes usa el flujo de ahorro del usuario.');
  }

  async aprobar(pagoId: string): Promise<PagoAhorro> {
    return this.cambiarEstado(pagoId, 'verificado');
  }

  async rechazar(pagoId: string, _contadorNombre: string, motivo?: string): Promise<PagoAhorro> {
    return this.cambiarEstado(pagoId, 'rechazado', motivo);
  }

  private async cambiarEstado(id: string, estado: 'verificado' | 'rechazado', observaciones?: string) {
    const { data } = await httpClient.patch<BackendEnvelope<BackendAporte> | BackendAporte>(
      `${API_CONFIG.endpoints.contador.aportes}/${id}/estado`,
      { estado, observaciones },
    );
    return mapAporte(unwrap(data));
  }
}

export const pagoAhorroHttpRepository = new PagoAhorroHttpAdapter();