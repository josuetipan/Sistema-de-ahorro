import { randomBytes, randomUUID } from 'node:crypto';
import * as bcrypt from 'bcrypt';
import { User } from '../../domain/user.entity';
import { UserRole, type UserRoleName } from '../../domain/user-role';
import { CityNotFoundError } from '../../domain/city-not-found.error';
import { UsuarioAlreadyTakenError } from '../../domain/usuario-already-taken.error';
import { EmailAlreadyTakenError } from '../../domain/email-already-taken.error';
import { RoleCodeNotFoundError } from '../../domain/role-code-not-found.error';
import { SocioCodigoAlreadyTakenError } from '../../domain/socio-codigo-already-taken.error';
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
  /** Requerido para socios (CUSTOMER) si no hay ciudad por defecto. */
  cityId?: string;
}

const SALT_ROUNDS = 10;
const DEFAULT_MATURITY = new Date('2099-12-31T23:59:59.999Z');
const DEFAULT_CITY_NAME = 'General';

function generateTempPassword(): string {
  return `Tmp${randomBytes(4).toString('hex')}1!`;
}

function generateSocioCodigo(): string {
  const suffix = randomBytes(3).toString('hex').toUpperCase();
  return `SOC-${suffix}`;
}

function generateInvitacionCodigo(usuario: string): string {
  const base =
    usuario
      .replace(/[^a-zA-Z0-9]/g, '')
      .slice(0, 4)
      .toUpperCase() || 'USER';
  const suffix = randomBytes(3).toString('hex').toUpperCase();
  return `AHORRO-${base}-${suffix}`;
}

export class RegisterUserUseCase {
  constructor(
    private readonly users: UserRepositoryPort,
    private readonly roles: RoleRepositoryPort,
    private readonly cities: CityRepositoryPort,
    private readonly socios: SocioRepositoryPort,
    private readonly invitaciones: InvitacionRepositoryPort,
  ) {}

  private async allocateUsuarioFromEmail(emailLocalPart: string): Promise<string> {
    const base =
      emailLocalPart
        .replace(/[^a-zA-Z0-9_]/g, '')
        .slice(0, 10)
        .toLowerCase() || 'user';
    let usuario = base;
    let n = 0;
    while (await this.users.findByUsuario(usuario)) {
      const suffix = String(++n);
      usuario = `${base.slice(0, Math.max(1, 10 - suffix.length))}${suffix}`;
    }
    return usuario;
  }

  private async resolveSocioCodigo(
    codigoReferencia?: string,
  ): Promise<string> {
    if (codigoReferencia?.trim()) {
      const codigo = codigoReferencia.trim().toUpperCase();
      if (await this.socios.existsByCodigo(codigo)) {
        throw new SocioCodigoAlreadyTakenError(codigo);
      }
      return codigo;
    }

    let codigo = generateSocioCodigo();
    let attempts = 0;
    while ((await this.socios.existsByCodigo(codigo)) && attempts < 8) {
      codigo = generateSocioCodigo();
      attempts++;
    }
    if (await this.socios.existsByCodigo(codigo)) {
      throw new Error('No se pudo generar un código de socio único');
    }
    return codigo;
  }

  private async resolveInvitacionCodigo(usuario: string): Promise<string> {
    let codigo = generateInvitacionCodigo(usuario);
    let attempts = 0;
    while ((await this.invitaciones.existsByCodigo(codigo)) && attempts < 8) {
      codigo = generateInvitacionCodigo(usuario);
      attempts++;
    }
    if (await this.invitaciones.existsByCodigo(codigo)) {
      throw new Error('No se pudo generar un código de invitación único');
    }
    return codigo;
  }

  async execute(input: RegisterUserInput): Promise<{
    id: string;
    usuario: string;
    email: string;
    fullName: string;
    phoneNumber: string;
    identification: string;
    cityId: string;
    cityName: string;
    roles: string[];
    socio?: { id: string; codigo: string; estado: string };
    invitacion: { id: string; codigo: string; activo: boolean };
    temporaryPassword?: string;
    pendingPasswordReset: boolean;
  }> {
    const email = input.email.trim().toLowerCase();
    if (await this.users.findByEmail(email)) {
      throw new EmailAlreadyTakenError(email);
    }

    const roleId = await this.roles.findIdByCode(input.roleCode);
    if (!roleId) {
      throw new RoleCodeNotFoundError(input.roleCode);
    }

    let cityId = input.cityId?.trim();
    let cityName: string;
    if (cityId) {
      const city = await this.cities.findActiveById(cityId);
      if (!city) {
        throw new CityNotFoundError();
      }
      cityId = city.id;
      cityName = city.name;
    } else {
      const city = await this.cities.ensureActiveByName(DEFAULT_CITY_NAME);
      cityId = city.id;
      cityName = city.name;
    }

    const localPart = email.split('@')[0] ?? 'user';
    const usuario = await this.allocateUsuarioFromEmail(localPart);

    const plainPassword = input.password?.trim() || generateTempPassword();
    const pendingPasswordReset = !input.password?.trim();
    const passwordHash = await bcrypt.hash(plainPassword, SALT_ROUNDS);

    const user = new User(
      randomUUID(),
      usuario,
      email,
      passwordHash,
      input.fullName.trim(),
      roleId,
      [input.roleCode],
      true,
      cityId,
      cityName,
      DEFAULT_MATURITY,
      input.phoneNumber.trim(),
      input.identification.trim(),
      pendingPasswordReset,
    );
    await this.users.save(user);

    let socio:
      | { id: string; codigo: string; estado: string }
      | undefined;

    if (input.roleCode === UserRole.CUSTOMER) {
      const codigo = await this.resolveSocioCodigo(input.codigoReferencia);
      const created = await this.socios.create({
        userId: user.id,
        codigo,
        estado: 'pendiente',
      });
      socio = {
        id: created.idSocio,
        codigo: created.codigo,
        estado: created.estado,
      };
    }

    const codigoInvitacion = await this.resolveInvitacionCodigo(user.usuario);
    const invitacionCreada = await this.invitaciones.create({
      userId: user.id,
      codigo: codigoInvitacion,
    });

    return {
      id: user.id,
      usuario: user.usuario,
      email,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber ?? input.phoneNumber.trim(),
      identification: user.identification ?? input.identification.trim(),
      cityId: user.cityId,
      cityName: user.cityName,
      roles: [...user.roles],
      socio,
      invitacion: {
        id: invitacionCreada.idInvitacion,
        codigo: invitacionCreada.codigo,
        activo: invitacionCreada.activo,
      },
      temporaryPassword: pendingPasswordReset ? plainPassword : undefined,
      pendingPasswordReset,
    };
  }
}
