import { StatusBadge } from '@shared/ui/molecules/StatusBadge';
import { formatCurrency, formatDate } from '@shared/lib/formatters';
import {
  calcularSaldoTotal,
  obtenerCodigoReferidor,
  obtenerNombreReferidor,
} from '../../domain/socio.rules';
import type { Socio } from '../../domain/socio.entity';
import { CuentaAhorroList } from './CuentaAhorroList';

const LABEL_ESTADO_SOCIO = {
  activo: 'Activo',
  inactivo: 'Inactivo',
  pendiente: 'Pendiente',
} as const;

interface SocioPerfilDetalleProps {
  socio: Socio;
  socios: Socio[];
}

export function SocioPerfilDetalle({ socio, socios }: SocioPerfilDetalleProps) {
  const referidoPorNombre = obtenerNombreReferidor(socio, socios);
  const codigoReferidor = obtenerCodigoReferidor(socio);

  return (
    <div className="space-y-5">
      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-slate-500">Nombres</dt>
          <dd className="font-medium">{socio.nombres}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Cédula</dt>
          <dd className="font-medium">{socio.cedula}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Correo</dt>
          <dd>{socio.email}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Teléfono</dt>
          <dd>{socio.telefono}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Código de referencia</dt>
          <dd className="font-mono font-semibold text-blue-700">{socio.codigoReferencia}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Referido por</dt>
          <dd>
            {codigoReferidor
              ? `${codigoReferidor}${referidoPorNombre ? ` · ${referidoPorNombre}` : ''}`
              : '—'}
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">Estado</dt>
          <dd>
            <StatusBadge status={socio.estado} label={LABEL_ESTADO_SOCIO[socio.estado]} />
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">Fecha de alta</dt>
          <dd>{formatDate(socio.fechaAlta)}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Saldo total</dt>
          <dd className="font-medium text-blue-600">{formatCurrency(calcularSaldoTotal(socio))}</dd>
        </div>
      </dl>

      <div>
        <p className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-slate-500">
          Cuentas de ahorro
        </p>
        <CuentaAhorroList cuentas={socio.cuentas} />
      </div>
    </div>
  );
}
