export const INVITACION_REPOSITORY = Symbol('INVITACION_REPOSITORY');

export interface InvitacionResumen {
  idInvitacion: string;
  codigo: string;
  activo: boolean;
  createdAt: Date;
  /** Nombre del socio dueño del código (para mostrar "asociado a ..."). */
  titular: string;
  /** Código del socio, si aplica. */
  socioCodigo: string | null;
}

export interface InvitacionRepositoryPort {
  /** Invitación del usuario autenticado (para compartir su código). */
  findByUserId(userId: string): Promise<InvitacionResumen | null>;
}
