import type { RoleRepositoryPort } from '../../domain/ports/role.repository.port';
import type {
  AdminUserRecord,
  UserRepositoryPort,
} from '../../domain/ports/user.repository.port';
import { UserRole, type UserRoleName } from '../../domain/user-role';

export interface UpdateAdminUserInput {
  id: string;
  fullName?: string;
  email?: string;
  identification?: string | null;
  phoneNumber?: string | null;
  roleCode?: UserRoleName;
}

const ADMIN_ROLES: UserRoleName[] = [
  UserRole.ADMIN,
  UserRole.CUSTOMER,
  UserRole.ACCOUNTANT,
];

export class ManageAdminUsersUseCase {
  constructor(
    private readonly users: UserRepositoryPort,
    private readonly roles: RoleRepositoryPort,
  ) {}

  list(): Promise<AdminUserRecord[]> {
    return this.users.listForAdmin();
  }

  async update(input: UpdateAdminUserInput): Promise<AdminUserRecord> {
    let roleId: string | undefined;
    if (input.roleCode !== undefined) {
      if (!ADMIN_ROLES.includes(input.roleCode)) {
        throw new Error('Rol no permitido');
      }
      roleId = (await this.roles.findIdByCode(input.roleCode)) ?? undefined;
      if (!roleId) throw new Error('Rol no encontrado');
    }

    return this.users.updateForAdmin({
      id: input.id,
      fullName: input.fullName?.trim(),
      email: input.email?.trim().toLowerCase(),
      identification: input.identification?.trim() || null,
      phoneNumber: input.phoneNumber?.trim() || null,
      roleId,
    });
  }

  setActive(id: string, isActive: boolean): Promise<AdminUserRecord> {
    return this.users.setActiveForAdmin(id, isActive);
  }
}