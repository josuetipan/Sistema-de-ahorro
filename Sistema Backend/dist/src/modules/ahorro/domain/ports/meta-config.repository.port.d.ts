export declare const META_CONFIG_REPOSITORY: unique symbol;
export interface MetaConfig {
    idConfiguracionMetaAhorro: string;
    metaMensual: number;
    metaMinima: number;
    metaMaxima: number;
    updatedAt: Date;
}
export interface ActualizarMetaConfigInput {
    metaMensual?: number;
    metaMinima?: number;
    metaMaxima?: number;
}
export interface MetaConfigRepositoryPort {
    getOrCreate(): Promise<MetaConfig>;
    actualizar(input: ActualizarMetaConfigInput): Promise<MetaConfig>;
}
