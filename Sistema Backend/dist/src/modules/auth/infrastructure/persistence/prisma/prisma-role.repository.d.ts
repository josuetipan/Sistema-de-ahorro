import type { CreateRolePersistenceInput, CreatedRoleRecord, RoleRepositoryPort } from '../../../domain/ports/role.repository.port';
import { PrismaService } from "../../../../../shared/infrastructure/prisma/prisma.service";
export declare class PrismaRoleRepository implements RoleRepositoryPort {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findIdByCode(code: string): Promise<string | null>;
    existsByCodeRole(code: string): Promise<boolean>;
    existsByName(name: string): Promise<boolean>;
    create(input: CreateRolePersistenceInput): Promise<CreatedRoleRecord>;
    listActive(): Promise<Array<{
        idRole: string;
        name: string;
        codeRole: string;
        description: string | null;
    }>>;
}
