import { CodeRoleAlreadyTakenError } from '../../domain/code-role-already-taken.error';
import { RoleNameAlreadyTakenError } from '../../domain/role-name-already-taken.error';
import type { RoleRepositoryPort } from '../../domain/ports/role.repository.port';

export interface CreateRoleInput {
  name: string;
  codeRole: string;
  description?: string | null;
  isActive?: boolean;
}

export class CreateRoleUseCase {
  constructor(private readonly roles: RoleRepositoryPort) {}

  async execute(input: CreateRoleInput) {
    const name = input.name.trim();
    const codeRole = input.codeRole.trim().toUpperCase();

    if (await this.roles.existsByCodeRole(codeRole)) {
      throw new CodeRoleAlreadyTakenError(codeRole);
    }
    if (await this.roles.existsByName(name)) {
      throw new RoleNameAlreadyTakenError(name);
    }

    const description =
      input.description === undefined || input.description === null
        ? null
        : input.description.trim() || null;
    const isActive = input.isActive ?? true;

    return this.roles.create({
      name,
      codeRole,
      description,
      isActive,
    });
  }
}
