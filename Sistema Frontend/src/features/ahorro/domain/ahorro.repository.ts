import type { DepositoInput, MetaAhorro, RetiroInput } from './ahorro.entity';

export interface IAhorroRepository {
  crearDeposito(input: DepositoInput): Promise<void>;
  retirar(input: RetiroInput): Promise<void>;
  getMetas(): Promise<MetaAhorro[]>;
}
