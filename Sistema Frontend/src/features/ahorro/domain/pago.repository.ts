import type { PagoAhorro, RegistrarPagoInput } from './pago.entity';

export interface IPagoAhorroRepository {
  listarPorCuenta(cuentaId: string): Promise<PagoAhorro[]>;
  listarTodos(): Promise<PagoAhorro[]>;
  listarPendientes(): Promise<PagoAhorro[]>;
  registrar(input: RegistrarPagoInput): Promise<PagoAhorro>;
  aprobar(pagoId: string, contadorNombre: string): Promise<PagoAhorro>;
  rechazar(pagoId: string, contadorNombre: string, motivo?: string): Promise<PagoAhorro>;
}
