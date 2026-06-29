import { PrismaService } from "../../../../../shared/infrastructure/prisma/prisma.service";
import type { InvitacionRepositoryPort, InvitacionResumen } from '../../../domain/ports/invitacion.repository.port';
export declare class PrismaInvitacionRepository implements InvitacionRepositoryPort {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByUserId(userId: string): Promise<InvitacionResumen | null>;
}
