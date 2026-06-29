export const BANNER_REPOSITORY = Symbol('BANNER_REPOSITORY');

export interface BannerResumen {
  idBanner: string;
  titulo: string;
  subtitulo: string | null;
  imagenUrl: string;
  orden: number;
  activo: boolean;
  createdAt: Date;
}

export interface CrearBannerInput {
  titulo: string;
  subtitulo?: string | null;
  imagenUrl: string;
  orden?: number;
  activo?: boolean;
}

export interface ActualizarBannerInput {
  titulo?: string;
  subtitulo?: string | null;
  imagenUrl?: string;
  orden?: number;
  activo?: boolean;
}

export interface BannerRepositoryPort {
  /** Banners activos ordenados (vista usuario). */
  listActive(): Promise<BannerResumen[]>;
  /** Todos los banners ordenados (vista admin). */
  listAll(): Promise<BannerResumen[]>;
  create(input: CrearBannerInput): Promise<BannerResumen>;
  findById(bannerId: string): Promise<BannerResumen | null>;
  update(bannerId: string, input: ActualizarBannerInput): Promise<BannerResumen>;
  delete(bannerId: string): Promise<void>;
}
