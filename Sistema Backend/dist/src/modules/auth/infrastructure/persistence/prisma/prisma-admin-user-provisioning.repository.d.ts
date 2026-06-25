import type { AdminUserProvisioningPort, CreateLinkedAdminPersistenceInput } from '../../../domain/ports/admin-user-provisioning.port';
import { PrismaService } from "../../../../../shared/infrastructure/prisma/prisma.service";
export declare class PrismaAdminUserProvisioningRepository implements AdminUserProvisioningPort {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createLinkedAdmin(input: CreateLinkedAdminPersistenceInput): Promise<{
        adminId: string;
    }>;
}
