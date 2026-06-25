import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { User } from '../../../domain/user.entity';
import type { UserRepositoryPort } from '../../../domain/ports/user.repository.port';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';

const userInclude = { role: true, city: true } as const;
type UserWithRelations = Prisma.UserGetPayload<{ include: typeof userInclude }>;

@Injectable()
export class PrismaUserRepository implements UserRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  private toDomain(row: UserWithRelations): User | null {
    if (!row.role?.is_active) {
      return null;
    }
    if (!row.city?.is_active) {
      return null;
    }
    return new User(
      row.id_user,
      row.usuario,
      row.email,
      row.password_hash,
      row.full_name,
      row.role_id,
      [row.role.code_role],
      row.is_active,
      row.city_id,
      row.city.name,
      row.maturity_at,
      row.phone_number,
      row.identification,
      row.pending_password_reset,
    );
  }

  async save(user: User): Promise<void> {
    await this.prisma.user.upsert({
      where: { usuario: user.usuario },
      create: {
        id_user: user.id,
        usuario: user.usuario,
        email: user.email ?? `${user.usuario}@local.invalid`,
        full_name: user.fullName,
        password_hash: user.passwordHash,
        role_id: user.roleId,
        city_id: user.cityId,
        maturity_at: user.maturityAt,
        phone_number: user.phoneNumber,
        identification: user.identification,
        is_active: user.isActive,
        pending_password_reset: user.pendingPasswordReset,
      },
      update: {
        email: user.email ?? `${user.usuario}@local.invalid`,
        password_hash: user.passwordHash,
        full_name: user.fullName,
        phone_number: user.phoneNumber,
        identification: user.identification,
        role_id: user.roleId,
        city_id: user.cityId,
        maturity_at: user.maturityAt,
        is_active: user.isActive,
        pending_password_reset: user.pendingPasswordReset,
      },
    });
  }

  async findByUsuario(usuario: string): Promise<User | null> {
    const row = await this.prisma.user.findUnique({
      where: { usuario: usuario.trim() },
      include: userInclude,
    });
    if (!row) {
      return null;
    }
    return this.toDomain(row);
  }

  async findByEmail(email: string): Promise<User | null> {
    const row = await this.prisma.user.findUnique({
      where: { email },
      include: userInclude,
    });
    if (!row) {
      return null;
    }
    return this.toDomain(row);
  }

  async findById(id: string): Promise<User | null> {
    const row = await this.prisma.user.findUnique({
      where: { id_user: id },
      include: userInclude,
    });
    if (!row) {
      return null;
    }
    return this.toDomain(row);
  }

  async touchLastLogin(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id_user: id },
      data: { last_login: new Date() },
    });
  }
}
