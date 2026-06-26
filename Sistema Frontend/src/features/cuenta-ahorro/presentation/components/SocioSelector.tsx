import type { SocioResumen } from '../../domain/cuenta-ahorro.entity';

interface SocioSelectorProps {
  resultados: SocioResumen[];
  seleccionadoId?: string;
  onSeleccionar: (socio: SocioResumen) => void;
}

export function SocioSelector({ resultados, seleccionadoId, onSeleccionar }: SocioSelectorProps) {
  if (resultados.length === 0) return null;

  return (
    <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white">
      {resultados.map((socio) => {
        const activo = socio.id === seleccionadoId;
        return (
          <li key={socio.id}>
            <button
              type="button"
              onClick={() => onSeleccionar(socio)}
              className={[
                'flex w-full flex-col gap-1 px-4 py-3 text-left text-sm motion-safe-transition hover:bg-slate-50',
                activo ? 'bg-emerald-50 ring-1 ring-inset ring-emerald-200' : '',
              ].join(' ')}
            >
              <span className="font-semibold text-slate-900">{socio.nombres}</span>
              <span className="text-slate-600">
                Cédula: {socio.cedula} · Código:{' '}
                <span className="font-mono text-xs">{socio.codigoReferencia}</span>
              </span>
              <span className="text-xs text-slate-500">{socio.email}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
