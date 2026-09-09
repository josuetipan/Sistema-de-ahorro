import type { User } from '../user.entity';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface AdminUserRecord {
  id: string;
  usuario: string;
  email: string | null;
  fullName: string;
  identification: string | null;
  phoneNumber: string | null;
  roleCode: string;
    address?: string | null;
  roleName: string;
  isActive: boolean;
  lastLogin: Date | null;
  createdAt: Date;
}

export interface UserRepositoryPort {
  save(user: User): Promise<void>;
  findByUsuario(usuario: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  touchLastLogin(id: string): Promise<void>;
  listForAdmin(): Promise<AdminUserRecord[]>;
  updateForAdmin(input: {
    id: string;
    fullName?: string;
    email?: string;
    identification?: string | null;
    phoneNumber?: string | null;
    roleId?: string;
    address?: string | null;
  }): Promise<AdminUserRecord>;
  setActiveForAdmin(id: string, isActive: boolean): Promise<AdminUserRecord>;
}
