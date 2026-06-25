import { randomUUID } from 'node:crypto';
import * as bcrypt from 'bcrypt';
import { EmailAlreadyTakenError } from '../../domain/email-already-taken.error';
import { RoleCodeNotFoundError } from '../../domain/role-code-not-found.error';
import { UserRole } from '../../domain/user-role';
import type { UserRepositoryPort } from '../../domain/ports/user.repository.port';
import type { RoleRepositoryPort } from '../../domain/ports/role.repository.port';
import type { CityRepositoryPort } from '../../domain/ports/city.repository.port';
import type { AdminUserProvisioningPort } from '../../domain/ports/admin-user-provisioning.port';

const ADMIN_CITY_NAME = 'Sistema';
const ADMIN_MATURITY_FAR = new Date('2099-12-31T23:59:59.999Z');

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

const SALT_ROUNDS = 10;

export class CreateAdminUserUseCase {
  constructor(
    private readonly users: UserRepositoryPort,
    private readonly roles: RoleRepositoryPort,
    private readonly cities: CityRepositoryPort,
    private readonly provisioning: AdminUserProvisioningPort,
  ) {}

  private async allocateUsuarioFromEmail(emailLocalPart: string): Promise<string> {
    const base =
      emailLocalPart
        .replace(/[^a-zA-Z0-9_]/g, '')
        .slice(0, 24)
        .toLowerCase() || 'admin';
    let usuario = base;
    let n = 0;
    while (await this.users.findByUsuario(usuario)) {
      usuario = `${base}${++n}`;
    }
    return usuario;
  }

  async execute(input: CreateAdminUserInput): Promise<CreateAdminUserResult> {
    const normalized = input.email.trim().toLowerCase();
    const existing = await this.users.findByEmail(normalized);
    if (existing) {
      throw new EmailAlreadyTakenError(normalized);
    }

    const systemCity = await this.cities.ensureActiveByName(ADMIN_CITY_NAME);

    const roleId = await this.roles.findIdByCode(UserRole.ADMIN);
    if (!roleId) {
      throw new RoleCodeNotFoundError(UserRole.ADMIN);
    }

    const localPart = normalized.split('@')[0] ?? 'admin';
    const usuario = await this.allocateUsuarioFromEmail(localPart);

    const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
    const userId = randomUUID();
    const phoneNumber = input.phoneNumber?.trim() || null;
    const identification = input.identification?.trim() || null;
    const fullName = input.fullName.trim();

    await this.provisioning.createLinkedAdmin({
      userId,
      usuario,
      email: normalized,
      passwordHash,
      fullName,
      roleId,
      cityId: systemCity.id,
      phoneNumber,
      identification,
      maturityAt: ADMIN_MATURITY_FAR,
    });

    const user = await this.users.findById(userId);
    if (!user) {
      throw new Error('Usuario administrador creado pero no recuperable');
    }

    return {
      message:
        'Administrador registrado correctamente. Usa POST /auth/login con el usuario indicado y la contraseña que definiste para obtener el token.',
      usuario: user.usuario,
      email: normalized,
    };
  }
}
