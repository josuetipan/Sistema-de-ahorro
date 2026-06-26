// Puerto del dominio: contrato de persistencia de cuentas
import type { Cuenta } from '../entities/Cuenta';

export interface ICuentaRepository {
  findById(id: string): Promise<Cuenta | null>;
  findByUsuarioId(usuarioId: string): Promise<Cuenta[]>;
  save(cuenta: Cuenta): Promise<Cuenta>;
  update(cuenta: Cuenta): Promise<Cuenta>;
}
