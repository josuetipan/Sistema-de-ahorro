import { StatusBadge } from '@shared/ui/molecules/StatusBadge';
import { formatCurrency } from '@shared/lib/formatters';
import type { CuentaAhorroSocio } from '../../domain/socio.entity';

const LABEL_ESTADO_CUENTA = {
  ACTIVA: 'Activa',
  INACTIVA: 'Inactiva',
} as const;

interface CuentaAhorroItemProps {
  cuenta: CuentaAhorroSocio;
}

export function CuentaAhorroItem({ cuenta }: CuentaAhorroItemProps) {
  return (
    <tr className="border-b border-slate-100 last:border-0">
      <td className="px-4 py-2.5 font-medium text-slate-800">{cuenta.numeroCuenta}</td>
      <td className="px-4 py-2.5 text-right font-medium text-blue-700">
        {formatCurrency(cuenta.saldo)}
      </td>
      <td className="px-4 py-2.5">
        <StatusBadge
          status={cuenta.estado.toLowerCase()}
          label={LABEL_ESTADO_CUENTA[cuenta.estado]}
        />
      </td>
    </tr>
  );
}
