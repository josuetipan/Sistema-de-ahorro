import type { IPagoAhorroRepository } from '../../domain/pago.repository';
import type { PagoAhorro, RegistrarPagoInput } from '../../domain/pago.entity';
import { generarComprobantePago, mesDesdeFecha } from '../../domain/pago.rules';
import { notifyPagosAhorroChanged } from '../../domain/pago.events';
import { MOCK_PAGOS_AHORRO_DATA } from '../data/pagos-ahorro.mock';

function clonarPagos(pagos: PagoAhorro[]): PagoAhorro[] {
  return pagos.map((p) => ({ ...p }));
}

export class PagoAhorroMockAdapter implements IPagoAhorroRepository {
  private pagos: PagoAhorro[];

  constructor(initial: PagoAhorro[] = MOCK_PAGOS_AHORRO_DATA) {
    this.pagos = clonarPagos(initial);
  }

  async listarPorCuenta(cuentaId: string): Promise<PagoAhorro[]> {
    return clonarPagos(this.pagos.filter((p) => p.cuentaId === cuentaId));
  }

  async listarTodos(): Promise<PagoAhorro[]> {
    return clonarPagos(this.pagos);
  }

  async listarPendientes(): Promise<PagoAhorro[]> {
    return clonarPagos(this.pagos.filter((p) => p.estado === 'PENDIENTE_VERIFICACION'));
  }

  async registrar(input: RegistrarPagoInput): Promise<PagoAhorro> {
    const nuevo: PagoAhorro = {
      id: `pag-${Date.now()}`,
      cuentaId: input.cuentaId,
      socioNombre: input.socioNombre,
      numeroCuenta: input.numeroCuenta,
      monto: input.monto,
      fecha: input.fecha,
      mes: mesDesdeFecha(input.fecha),
      comprobante: input.comprobante || generarComprobantePago(),
      archivoNombre: input.archivoNombre,
      comprobanteUrl: input.comprobanteUrl,
      estado: 'PENDIENTE_VERIFICACION',
    };

    this.pagos = [...this.pagos, nuevo];
    notifyPagosAhorroChanged();
    return { ...nuevo };
  }

  async aprobar(pagoId: string, contadorNombre: string): Promise<PagoAhorro> {
    const pago = this.pagos.find((p) => p.id === pagoId);
    if (!pago) throw new Error('Pago no encontrado.');
    if (pago.estado !== 'PENDIENTE_VERIFICACION') {
      throw new Error('Solo se pueden aprobar pagos pendientes de verificación.');
    }

    const actualizado: PagoAhorro = {
      ...pago,
      estado: 'VERIFICADO',
      verificadoPor: contadorNombre,
      fechaVerificacion: new Date().toISOString(),
    };

    this.pagos = this.pagos.map((p) => (p.id === pagoId ? actualizado : p));
    notifyPagosAhorroChanged();
    return { ...actualizado };
  }

  async rechazar(pagoId: string, contadorNombre: string, motivo?: string): Promise<PagoAhorro> {
    const pago = this.pagos.find((p) => p.id === pagoId);
    if (!pago) throw new Error('Pago no encontrado.');
    if (pago.estado !== 'PENDIENTE_VERIFICACION') {
      throw new Error('Solo se pueden rechazar pagos pendientes de verificación.');
    }

    const actualizado: PagoAhorro = {
      ...pago,
      estado: 'RECHAZADO',
      verificadoPor: contadorNombre,
      fechaVerificacion: new Date().toISOString(),
      motivoRechazo: motivo ?? 'Comprobante no válido',
    };

    this.pagos = this.pagos.map((p) => (p.id === pagoId ? actualizado : p));
    notifyPagosAhorroChanged();
    return { ...actualizado };
  }
}

export const pagoAhorroMockRepository = new PagoAhorroMockAdapter();
