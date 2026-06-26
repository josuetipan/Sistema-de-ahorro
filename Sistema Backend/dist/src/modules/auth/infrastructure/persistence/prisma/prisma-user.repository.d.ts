import { User } from '../../../domain/user.entity';
import type { UserRepositoryPort } from '../../../domain/ports/user.repository.port';
import { PrismaService } from "../../../../../shared/infrastructure/prisma/prisma.service";
export declare class PrismaUserRepository implements UserRepositoryPort {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private toDomain;
    save(user: User): Promise<void>;
    findByUsuario(usuario: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    touchLastLogin(id: string): Promise<void>;
}
