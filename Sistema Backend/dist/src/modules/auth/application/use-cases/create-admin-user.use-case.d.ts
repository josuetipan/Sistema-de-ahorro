import type { UserRepositoryPort } from '../../domain/ports/user.repository.port';
import type { RoleRepositoryPort } from '../../domain/ports/role.repository.port';
import type { CityRepositoryPort } from '../../domain/ports/city.repository.port';
import type { AdminUserProvisioningPort } from '../../domain/ports/admin-user-provisioning.port';
export interface CreateAdminUserInput {
    email: string;
    password: string;
    fullName: string;
    phoneNumber?: string;
    identification?: string;
}
export interface CreateAdminUserResult {
    message: string;
    usuario: string;
    email: string;
}
export declare class CreateAdminUserUseCase {
    private readonly users;
    private readonly roles;
    private readonly cities;
    private readonly provisioning;
    constructor(users: UserRepositoryPort, roles: RoleRepositoryPort, cities: CityRepositoryPort, provisioning: AdminUserProvisioningPort);
    private allocateUsuarioFromEmail;
    execute(input: CreateAdminUserInput): Promise<CreateAdminUserResult>;
}
