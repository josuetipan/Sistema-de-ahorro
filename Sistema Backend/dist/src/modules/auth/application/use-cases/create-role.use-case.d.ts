import type { RoleRepositoryPort } from '../../domain/ports/role.repository.port';
export interface CreateRoleInput {
    name: string;
    codeRole: string;
    description?: string | null;
    isActive?: boolean;
}
export declare class CreateRoleUseCase {
    private readonly roles;
    constructor(roles: RoleRepositoryPort);
    execute(input: CreateRoleInput): Promise<import("../../domain/ports/role.repository.port").CreatedRoleRecord>;
}
