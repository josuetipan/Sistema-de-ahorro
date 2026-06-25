import { type UserRoleName } from '../../domain/user-role';
import type { UserRepositoryPort } from '../../domain/ports/user.repository.port';
import type { RoleRepositoryPort } from '../../domain/ports/role.repository.port';
import type { CityRepositoryPort } from '../../domain/ports/city.repository.port';
import type { SocioRepositoryPort } from '../../domain/ports/socio.repository.port';
import type { InvitacionRepositoryPort } from '../../domain/ports/invitacion.repository.port';
export interface RegisterUserInput {
    fullName: string;
    identification: string;
    email: string;
    phoneNumber: string;
    roleCode: UserRoleName;
    codigoReferencia?: string;
    password?: string;
    cityId?: string;
}
export declare class RegisterUserUseCase {
    private readonly users;
    private readonly roles;
    private readonly cities;
    private readonly socios;
    private readonly invitaciones;
    constructor(users: UserRepositoryPort, roles: RoleRepositoryPort, cities: CityRepositoryPort, socios: SocioRepositoryPort, invitaciones: InvitacionRepositoryPort);
    private allocateUsuarioFromEmail;
    private resolveSocioCodigo;
    private resolveInvitacionCodigo;
    execute(input: RegisterUserInput): Promise<{
        id: string;
        usuario: string;
        email: string;
        fullName: string;
        phoneNumber: string;
        identification: string;
        cityId: string;
        cityName: string;
        roles: string[];
        socio?: {
            id: string;
            codigo: string;
            estado: string;
        };
        invitacion: {
            id: string;
            codigo: string;
            activo: boolean;
        };
        temporaryPassword?: string;
        pendingPasswordReset: boolean;
    }>;
}
