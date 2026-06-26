import type { Credito } from '../../domain/credito.entity';
import type { CreditoDTO } from '../dtos/credito.dto';

export function toCreditoEntity(dto: CreditoDTO): Credito {
  return { ...dto };
}

export function toCreditoEntityList(dtos: CreditoDTO[]): Credito[] {
  return dtos.map(toCreditoEntity);
}
