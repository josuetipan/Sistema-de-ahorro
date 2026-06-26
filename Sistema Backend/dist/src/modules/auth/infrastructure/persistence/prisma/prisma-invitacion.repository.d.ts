import type { CreateInvitacionPersistenceInput, CreatedInvitacionRecord, InvitacionRepositoryPort } from '../../../domain/ports/invitacion.repository.port';
import { PrismaService } from "../../../../../shared/infrastructure/prisma/prisma.service";
export declare class PrismaInvitacionRepository implements InvitacionRepositoryPort {
    private readonly prisma;
    constructor(prisma: PrismaService);
    existsByCodigo(codigo: string): Promise<boolean>;
    create(input: CreateInvitacionPersistenceInput): Promise<CreatedInvitacionRecord>;
}
