import type { CuentaAhorroPublica } from '../../domain/cuenta-ahorro.entity';
import { AccountCard } from './AccountCard';

interface AccountListProps {
  cuentas: CuentaAhorroPublica[];
  titulo?: string;
  vacio?: string;
}

export function AccountList({
  cuentas,
  titulo = 'Cuentas del socio',
  vacio = 'Este socio no tiene cuentas registradas.',
}: AccountListProps) {
  if (cuentas.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
        {vacio}
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {titulo && (
        <p className="text-[12px] font-semibold uppercase tracking-wide text-slate-500">{titulo}</p>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        {cuentas.map((cuenta) => (
          <AccountCard key={cuenta.id} cuenta={cuenta} />
        ))}
      </div>
    </div>
  );
}
