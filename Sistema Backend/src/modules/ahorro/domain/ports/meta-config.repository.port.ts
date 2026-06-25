export const META_CONFIG_REPOSITORY = Symbol('META_CONFIG_REPOSITORY');

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
  /** Devuelve la meta global; la crea con ceros si aún no existe. */
  getOrCreate(): Promise<MetaConfig>;
  actualizar(input: ActualizarMetaConfigInput): Promise<MetaConfig>;
}
