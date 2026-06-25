export const ROLE_REPOSITORY = Symbol('ROLE_REPOSITORY');

export interface CreateRolePersistenceInput {
  name: string;
  codeRole: string;
  description: string | null;
  isActive: boolean;
}

export interface CreatedRoleRecord {
  idRole: string;
  name: string;
  codeRole: string;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
}

export interface RoleRepositoryPort {
  /** Resuelve el `id_role` de un rol activo por `code_role`. */
  findIdByCode(code: string): Promise<string | null>;
  existsByCodeRole(code: string): Promise<boolean>;
  existsByName(name: string): Promise<boolean>;
  create(input: CreateRolePersistenceInput): Promise<CreatedRoleRecord>;
  listActive(): Promise<
    Array<{ idRole: string; name: string; codeRole: string; description: string | null }>
  >;
}
