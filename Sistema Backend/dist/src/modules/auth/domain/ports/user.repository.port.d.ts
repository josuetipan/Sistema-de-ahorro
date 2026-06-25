import type { User } from '../user.entity';
export declare const USER_REPOSITORY: unique symbol;
export interface UserRepositoryPort {
    save(user: User): Promise<void>;
    findByUsuario(usuario: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    touchLastLogin(id: string): Promise<void>;
}
