import type { UseCase } from "../../../../shared/application/use-case.interface";
import { type InvitacionRepositoryPort, type InvitacionResumen } from '../../domain/ports/invitacion.repository.port';
export declare class GetMiInvitacionUseCase implements UseCase<string, InvitacionResumen> {
    private readonly invitaciones;
    constructor(invitaciones: InvitacionRepositoryPort);
    execute(userId: string): Promise<InvitacionResumen>;
}
