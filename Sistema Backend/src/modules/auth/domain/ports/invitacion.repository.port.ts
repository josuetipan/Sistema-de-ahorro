export const INVITACION_REPOSITORY = Symbol('INVITACION_REPOSITORY');

export interface CreateInvitacionPersistenceInput {
  userId: string;
  codigo: string;
}

export interface CreatedInvitacionRecord {
  idInvitacion: string;
  codigo: string;
  activo: boolean;
}

export interface InvitacionRepositoryPort {
  existsByCodigo(codigo: string): Promise<boolean>;
  create(input: CreateInvitacionPersistenceInput): Promise<CreatedInvitacionRecord>;
}
