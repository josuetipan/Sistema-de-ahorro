import { Injectable } from '@nestjs/common';
import type {
  AdminUserProvisioningPort,
  CreateLinkedAdminPersistenceInput,
} from '../../../domain/ports/admin-user-provisioning.port';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';

@Injectable()
export class PrismaAdminUserProvisioningRepository
  implements AdminUserProvisioningPort
{
  constructor(private readonly prisma: PrismaService) {}

  async createLinkedAdmin(
    input: CreateLinkedAdminPersistenceInput,
  ): Promise<{ adminId: string }> {
    const adminRow = await this.prisma.$transaction(async (tx) => {
      await tx.user.create({
        data: {
          id_user: input.userId,
          usuario: input.usuario,
          email: input.email,
          password_hash: input.passwordHash,
          full_name: input.fullName,
          role_id: input.roleId,
          city_id: input.cityId,
          maturity_at: input.maturityAt,
          phone_number: input.phoneNumber,
          identification: input.identification,
          is_active: true,
          pending_password_reset: false,
        },
      });
      return tx.admin.create({
        data: {
          user_id: input.userId,
          full_name: input.fullName,
          email: input.email,
          identification: input.identification,
        },
      });
    });
    return { adminId: adminRow.id_admin };
  }
}
