export const ADMIN_USER_PROVISIONING = Symbol('ADMIN_USER_PROVISIONING');

export interface CreateLinkedAdminPersistenceInput {
  userId: string;
  usuario: string;
  email: string;
  passwordHash: string;
  fullName: string;
  roleId: string;
  cityId: string;
  phoneNumber: string | null;
  identification: string | null;
  maturityAt: Date;
}

export interface AdminUserProvisioningPort {
  /** Crea `users` + `admins` en una sola transacción. */
  createLinkedAdmin(
    input: CreateLinkedAdminPersistenceInput,
  ): Promise<{ adminId: string }>;
}
