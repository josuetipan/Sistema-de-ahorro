import type { CuentaAhorroSocio } from '../../domain/socio.entity';
import { CuentaAhorroItem } from './CuentaAhorroItem';

interface CuentaAhorroListProps {
  cuentas: CuentaAhorroSocio[];
}

export function CuentaAhorroList({ cuentas }: CuentaAhorroListProps) {
  if (cuentas.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
        Este socio no tiene cuentas de ahorro registradas.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            <th className="px-4 py-2.5">No. cuenta</th>
            <th className="px-4 py-2.5 text-right">Saldo</th>
            <th className="px-4 py-2.5">Estado</th>
          </tr>
        </thead>
        <tbody>
          {cuentas.map((cuenta) => (
            <CuentaAhorroItem key={cuenta.id} cuenta={cuenta} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
