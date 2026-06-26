export declare const ADMIN_USER_PROVISIONING: unique symbol;
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
    createLinkedAdmin(input: CreateLinkedAdminPersistenceInput): Promise<{
        adminId: string;
    }>;
}
