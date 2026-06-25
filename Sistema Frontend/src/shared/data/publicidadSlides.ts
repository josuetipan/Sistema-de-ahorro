import publicidad1 from '@shared/assets/Publicidad1.png';
import publicidad2 from '@shared/assets/Publicidad2.png';
import publicidad3 from '@shared/assets/Publicidad3.png';

export interface PublicidadSlide {
  id: string;
  titulo: string;
  subtitulo?: string;
  imagen?: string;
  enlace?: string;
  fondo: string;
}

export const PUBLICIDAD_SLIDES: PublicidadSlide[] = [
  {
    id: 'pub-1',
    titulo: 'Aprender a ahorrar desde pequeños — Finnova',
    imagen: publicidad1,
    fondo: 'bg-[#000B26]',
  },
  {
    id: 'pub-2',
    titulo: 'Tu respaldo empieza hoy — Finnova',
    imagen: publicidad2,
    fondo: 'bg-[#000B26]',
  },
  {
    id: 'pub-3',
    titulo: 'Ahorra con confianza en Finnova',
    imagen: publicidad3,
    fondo: 'bg-[#000B26]',
  },
];
