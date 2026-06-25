import type { User } from '../user.entity';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface UserRepositoryPort {
  save(user: User): Promise<void>;
  findByUsuario(usuario: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  touchLastLogin(id: string): Promise<void>;
}
