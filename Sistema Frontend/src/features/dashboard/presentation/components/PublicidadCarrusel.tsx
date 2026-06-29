import { useCallback, useRef, useState, type KeyboardEvent, type TouchEvent } from 'react';
import { PUBLICIDAD_SLIDES } from '@shared/data/publicidadSlides';

const SWIPE_MIN = 48;

function ChevronIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden
    >
      {direction === 'left' ? (
        <path d="M15 18l-6-6 6-6" />
      ) : (
        <path d="M9 18l6-6-6-6" />
      )}
    </svg>
  );
}

export function PublicidadCarrusel() {
  const slides = PUBLICIDAD_SLIDES;
  const [indice, setIndice] = useState(0);
  const touchInicio = useRef(0);

  const irAnterior = useCallback(() => {
    setIndice((i) => (i - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const irSiguiente = useCallback(() => {
    setIndice((i) => (i + 1) % slides.length);
  }, [slides.length]);

  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === 'ArrowLeft') irAnterior();
    if (e.key === 'ArrowRight') irSiguiente();
  };

  const onTouchStart = (e: TouchEvent) => {
    touchInicio.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: TouchEvent) => {
    const delta = e.changedTouches[0].clientX - touchInicio.current;
    if (delta > SWIPE_MIN) irAnterior();
    else if (delta < -SWIPE_MIN) irSiguiente();
  };

  if (slides.length === 0) return null;

  return (
    <section
      aria-roledescription="carrusel"
      aria-label="Publicidad"
      className="relative w-full"
      onKeyDown={onKeyDown}
      tabIndex={0}
    >
      <div className="relative overflow-hidden rounded-xl border border-slate-200/80 bg-slate-100 shadow-sm">
        <div
          className="flex motion-safe-transition duration-500 ease-out"
          style={{ transform: `translateX(-${indice * 100}%)` }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {slides.map((slide) => {
            const contenido = (
              <div
                className={[
                  'relative flex aspect-[21/5] w-full shrink-0 items-center justify-center overflow-hidden sm:aspect-[21/4]',
                  slide.imagen ? 'bg-[#000B26]' : slide.fondo,
                ].join(' ')}
              >
                {slide.imagen ? (
                  <img
                    src={slide.imagen}
                    alt={slide.titulo}
                    className="h-full w-full object-cover"
                    draggable={false}
                  />
                ) : (
                  <>
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.12),transparent_45%)]" />
                    <div className="relative z-10 max-w-lg px-6 text-center text-white">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-200/90">
                        Publicidad
                      </p>
                      <h3 className="mt-2 text-lg font-semibold sm:text-xl">{slide.titulo}</h3>
                      {slide.subtitulo && (
                        <p className="mt-1 text-xs text-white/75 sm:text-sm">{slide.subtitulo}</p>
                      )}
                    </div>
                  </>
                )}
              </div>
            );

            if (slide.enlace) {
              return (
                <a
                  key={slide.id}
                  href={slide.enlace}
                  className="block w-full shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                  aria-label={slide.titulo}
                >
                  {contenido}
                </a>
              );
            }

            return (
              <div key={slide.id} className="w-full shrink-0">
                {contenido}
              </div>
            );
          })}
        </div>

        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={irAnterior}
              aria-label="Publicidad anterior"
              className={[
                'absolute left-2 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full',
                'border border-white/20 bg-black/35 text-white backdrop-blur-sm',
                'motion-safe-transition hover:bg-black/50',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400',
              ].join(' ')}
            >
              <ChevronIcon direction="left" />
            </button>
            <button
              type="button"
              onClick={irSiguiente}
              aria-label="Publicidad siguiente"
              className={[
                'absolute right-2 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full',
                'border border-white/20 bg-black/35 text-white backdrop-blur-sm',
                'motion-safe-transition hover:bg-black/50',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400',
              ].join(' ')}
            >
              <ChevronIcon direction="right" />
            </button>
          </>
        )}
      </div>

      {slides.length > 1 && (
        <div className="mt-2 flex items-center justify-center gap-1.5">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`Ir a publicidad ${i + 1}`}
              aria-current={i === indice ? 'true' : undefined}
              onClick={() => setIndice(i)}
              className={[
                'h-1.5 rounded-full motion-safe-transition',
                i === indice ? 'w-5 bg-emerald-500' : 'w-1.5 bg-slate-300 hover:bg-slate-400',
              ].join(' ')}
            />
          ))}
        </div>
      )}
    </section>
  );
}
