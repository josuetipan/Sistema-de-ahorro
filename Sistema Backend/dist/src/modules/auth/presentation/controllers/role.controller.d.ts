import { CreateRoleUseCase } from '../../application/use-cases/create-role.use-case';
import { type RoleRepositoryPort } from '../../domain/ports/role.repository.port';
import { CreateRoleHttpDto } from '../dto/create-role.http.dto';
export declare class RoleController {
    private readonly createRole;
    private readonly roles;
    constructor(createRole: CreateRoleUseCase, roles: RoleRepositoryPort);
    list(): Promise<{
        id: string;
        name: string;
        codeRole: string;
        description: string | null;
    }[]>;
    create(body: CreateRoleHttpDto): Promise<{
        id: string;
        name: string;
        codeRole: string;
        description: string | null;
        isActive: boolean;
        createdAt: Date;
    }>;
}
