export declare const INVITACION_REPOSITORY: unique symbol;
export interface InvitacionResumen {
    idInvitacion: string;
    codigo: string;
    activo: boolean;
    createdAt: Date;
    titular: string;
    socioCodigo: string | null;
}
export interface InvitacionRepositoryPort {
    findByUserId(userId: string): Promise<InvitacionResumen | null>;
}
