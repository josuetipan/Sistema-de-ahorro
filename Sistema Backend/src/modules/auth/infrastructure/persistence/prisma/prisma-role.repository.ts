import { Injectable } from '@nestjs/common';
import type {
  CreateRolePersistenceInput,
  CreatedRoleRecord,
  RoleRepositoryPort,
} from '../../../domain/ports/role.repository.port';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';

@Injectable()
export class PrismaRoleRepository implements RoleRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findIdByCode(code: string): Promise<string | null> {
    const row = await this.prisma.role.findFirst({
      where: {
        code_role: code,
        is_active: true,
      },
      select: { id_role: true },
    });
    return row?.id_role ?? null;
  }

  async existsByCodeRole(code: string): Promise<boolean> {
    const row = await this.prisma.role.findUnique({
      where: { code_role: code },
      select: { id_role: true },
    });
    return row !== null;
  }

  async existsByName(name: string): Promise<boolean> {
    const row = await this.prisma.role.findUnique({
      where: { name },
      select: { id_role: true },
    });
    return row !== null;
  }

  async create(input: CreateRolePersistenceInput): Promise<CreatedRoleRecord> {
    const row = await this.prisma.role.create({
      data: {
        name: input.name,
        code_role: input.codeRole,
        description: input.description,
        is_active: input.isActive,
      },
    });
    return {
      idRole: row.id_role,
      name: row.name,
      codeRole: row.code_role,
      description: row.description,
      isActive: row.is_active,
      createdAt: row.createdAt,
    };
  }

  async listActive(): Promise<
    Array<{ idRole: string; name: string; codeRole: string; description: string | null }>
  > {
    const rows = await this.prisma.role.findMany({
      where: { is_active: true },
      orderBy: { name: 'asc' },
      select: {
        id_role: true,
        name: true,
        code_role: true,
        description: true,
      },
    });
    return rows.map((row) => ({
      idRole: row.id_role,
      name: row.name,
      codeRole: row.code_role,
      description: row.description,
    }));
  }
}
