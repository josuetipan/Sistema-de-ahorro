import type { ICuentaRepository } from '../../domain/cuenta.repository';
import type {
  Aporte,
  AportesPage,
  CalendarioAhorro,
  CrearCuentaInput,
  CuentaCreada,
  Invitacion,
  ListarAportesParams,
  RegistrarAporteInput,
  ResumenAhorroGlobal,
} from '../../domain/cuenta.entity';
import * as cuentaApi from '../api/cuenta.api';
import {
  toAporte,
  toAportesPage,
  toCalendarioAhorro,
  toCuentaCreada,
  toInvitacion,
  toResumenGlobal,
} from '../mappers/cuenta.mapper';

export class CuentaHttpAdapter implements ICuentaRepository {
  async obtenerResumen(): Promise<ResumenAhorroGlobal> {
    const dto = await cuentaApi.getResumenAhorro();
    return toResumenGlobal(dto);
  }

  async crearCuenta(input: CrearCuentaInput): Promise<CuentaCreada> {
    const dto = await cuentaApi.postCrearCuenta(input);
    return toCuentaCreada(dto);
  }

  async listarAportes(params: ListarAportesParams): Promise<AportesPage> {
    const body = await cuentaApi.getAportes(params);
    return toAportesPage(body);
  }

  async registrarAporte(input: RegistrarAporteInput): Promise<Aporte> {
    const formData = new FormData();
    formData.append('archivo', input.archivo);
    formData.append('mes', input.mes);
    formData.append('monto', String(input.monto));
    formData.append('comprobante', input.comprobante);
    if (input.referencia) formData.append('referencia', input.referencia);
    if (input.archivoNombre) formData.append('archivoNombre', input.archivoNombre);
    if (input.descripcion) formData.append('descripcion', input.descripcion);

    const dto = await cuentaApi.postRegistrarAporte(input.cuentaId, formData);
    return toAporte(dto);
  }

  async obtenerCalendario(cuentaId: string, anio: number): Promise<CalendarioAhorro> {
    const dto = await cuentaApi.getCalendario(cuentaId, anio);
    return toCalendarioAhorro(dto);
  }

  async obtenerMiInvitacion(): Promise<Invitacion> {
    const dto = await cuentaApi.getMiInvitacion();
    return toInvitacion(dto);
  }
}
