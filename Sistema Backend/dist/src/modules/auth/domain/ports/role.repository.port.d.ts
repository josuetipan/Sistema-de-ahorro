export declare const ROLE_REPOSITORY: unique symbol;
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
    findIdByCode(code: string): Promise<string | null>;
    existsByCodeRole(code: string): Promise<boolean>;
    existsByName(name: string): Promise<boolean>;
    create(input: CreateRolePersistenceInput): Promise<CreatedRoleRecord>;
    listActive(): Promise<Array<{
        idRole: string;
        name: string;
        codeRole: string;
        description: string | null;
    }>>;
}
