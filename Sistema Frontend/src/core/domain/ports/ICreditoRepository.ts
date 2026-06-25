// Puerto del dominio: contrato de persistencia de créditos
import type { Credito } from '../entities/Credito';

export interface ICreditoRepository {
  findById(id: string): Promise<Credito | null>;
  findByCuentaId(cuentaId: string): Promise<Credito[]>;
  save(credito: Credito): Promise<Credito>;
  update(credito: Credito): Promise<Credito>;
}
