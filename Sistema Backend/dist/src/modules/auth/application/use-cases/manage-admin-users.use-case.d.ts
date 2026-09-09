import type { RoleRepositoryPort } from '../../domain/ports/role.repository.port';
import type { AdminUserRecord, UserRepositoryPort } from '../../domain/ports/user.repository.port';
import { type UserRoleName } from '../../domain/user-role';
export interface UpdateAdminUserInput {
    id: string;
    fullName?: string;
    email?: string;
    identification?: string | null;
    phoneNumber?: string | null;
    roleCode?: UserRoleName;
}
export declare class ManageAdminUsersUseCase {
    private readonly users;
    private readonly roles;
    constructor(users: UserRepositoryPort, roles: RoleRepositoryPort);
    list(): Promise<AdminUserRecord[]>;
    update(input: UpdateAdminUserInput): Promise<AdminUserRecord>;
    setActive(id: string, isActive: boolean): Promise<AdminUserRecord>;
}
