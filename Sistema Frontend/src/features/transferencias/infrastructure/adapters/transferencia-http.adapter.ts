import type { ITransferenciaRepository } from '../../domain/transferencia.repository';
import type { TransferenciaInput } from '../../domain/transferencia.rules';
import * as transferenciaApi from '../api/transferencia.api';

export class TransferenciaHttpAdapter implements ITransferenciaRepository {
  async realizar(input: TransferenciaInput): Promise<void> {
    await transferenciaApi.postTransferencia({
      cuentaOrigenId: input.cuentaOrigenId,
      cuentaDestinoId: input.cuentaDestinoId,
      monto: input.monto,
    });
  }

  async getHistorial(): Promise<unknown[]> {
    return transferenciaApi.getHistorialApi();
  }
}

export const transferenciaRepository = new TransferenciaHttpAdapter();
