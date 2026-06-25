import type { EstadoSocio } from '@prisma/client';
export declare const SOCIO_REPOSITORY: unique symbol;
export interface CreateSocioPersistenceInput {
    userId: string;
    codigo: string;
    estado?: EstadoSocio;
}
export interface CreatedSocioRecord {
    idSocio: string;
    codigo: string;
    estado: EstadoSocio;
}
export interface SocioRepositoryPort {
    existsByCodigo(codigo: string): Promise<boolean>;
    create(input: CreateSocioPersistenceInput): Promise<CreatedSocioRecord>;
}
