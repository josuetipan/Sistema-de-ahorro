import type { IAhorroRepository } from '../../domain/ahorro.repository';
import type { DepositoInput, MetaAhorro, RetiroInput } from '../../domain/ahorro.entity';
import * as ahorroApi from '../api/ahorro.api';

export class AhorroHttpAdapter implements IAhorroRepository {
  async crearDeposito(input: DepositoInput): Promise<void> {
    await ahorroApi.postDeposito(input.cuentaId, input.monto);
  }

  async retirar(input: RetiroInput): Promise<void> {
    await ahorroApi.postRetiro(input.cuentaId, input.monto);
  }

  async getMetas(): Promise<MetaAhorro[]> {
    const data = await ahorroApi.getMetasApi();
    return data as MetaAhorro[];
  }
}

export const ahorroRepository = new AhorroHttpAdapter();
