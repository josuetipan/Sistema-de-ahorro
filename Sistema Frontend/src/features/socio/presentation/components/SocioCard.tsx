import { useState } from 'react';
import { TableActionButton, TableActions } from '@shared/ui/molecules/TableActions';
import { StatusBadge } from '@shared/ui/molecules/StatusBadge';
import { formatCurrency } from '@shared/lib/formatters';
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

interface SocioCardProps {
  socio: Socio;
  socios: Socio[];
  onVer: (socio: Socio) => void;
  onEditar: (socio: Socio) => void;
  onToggleEstado: (socio: Socio) => void;
}

export function SocioCard({ socio, socios, onVer, onEditar, onToggleEstado }: SocioCardProps) {
  const [expandido, setExpandido] = useState(false);
  const referidoPorNombre = obtenerNombreReferidor(socio, socios);
  const codigoReferidor = obtenerCodigoReferidor(socio);
  const saldoTotal = calcularSaldoTotal(socio);

  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 p-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-slate-900">{socio.nombres}</h3>
            <StatusBadge status={socio.estado} label={LABEL_ESTADO_SOCIO[socio.estado]} />
          </div>

          <dl className="grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Cédula</dt>
              <dd className="font-medium text-slate-800">{socio.cedula}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Correo</dt>
              <dd className="text-slate-700">{socio.email}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Teléfono</dt>
              <dd className="text-slate-700">{socio.telefono}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                Código de referencia
              </dt>
              <dd className="font-mono text-sm font-semibold text-blue-700">{socio.codigoReferencia}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Referido por</dt>
              <dd className="text-slate-700">
                {codigoReferidor ? (
                  <span>
                    <span className="font-mono text-xs font-medium">{codigoReferidor}</span>
                    {referidoPorNombre && (
                      <span className="ml-1 text-slate-500">· {referidoPorNombre}</span>
                    )}
                  </span>
                ) : (
                  <span className="text-slate-400">—</span>
                )}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Saldo total</dt>
              <dd className="font-semibold text-blue-700">{formatCurrency(saldoTotal)}</dd>
            </div>
          </dl>
        </div>

        <div className="shrink-0">
          <TableActions>
            <TableActionButton type="button" onClick={() => setExpandido((prev) => !prev)}>
              {expandido ? 'Ocultar cuentas' : `Ver cuentas (${socio.cuentas.length})`}
            </TableActionButton>
            <TableActionButton type="button" onClick={() => onVer(socio)}>
              Perfil
            </TableActionButton>
            <TableActionButton type="button" onClick={() => onEditar(socio)}>
              Editar
            </TableActionButton>
            <TableActionButton type="button" onClick={() => onToggleEstado(socio)}>
              {socio.estado === 'activo' ? 'Desactivar' : 'Activar'}
            </TableActionButton>
          </TableActions>
        </div>
      </div>

      {expandido && (
        <div className="border-t border-slate-100 bg-slate-50/60 px-4 py-4">
          <p className="mb-3 text-[12px] font-semibold uppercase tracking-wide text-slate-500">
            Cuentas de ahorro
          </p>
          <CuentaAhorroList cuentas={socio.cuentas} />
        </div>
      )}
    </article>
  );
}
