import type { AuthSession } from '../../domain/auth.entity';
import type { AuthResponseDTO } from '../dtos/auth.dto';

export function toAuthSession(dto: AuthResponseDTO): AuthSession {
  return { user: dto.user, token: dto.token };
}
