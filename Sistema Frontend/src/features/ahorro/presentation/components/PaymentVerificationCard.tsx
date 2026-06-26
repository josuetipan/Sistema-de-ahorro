import { ActionButton } from '@shared/ui/atoms/ActionButton';
import { Input } from '@shared/ui/atoms/Input';
import { StatusBadge } from '@shared/ui/molecules/StatusBadge';
import { formatCurrency, formatDate } from '@shared/lib/formatters';
import type { PagoAhorro } from '../../domain/pago.entity';
import { toReceiptViewData } from '../../domain/receipt.utils';
import { ReceiptViewerButton } from './receipt/ReceiptViewerButton';

interface PaymentVerificationCardProps {
  pago: PagoAhorro;
  motivo: string;
  procesando: boolean;
  onMotivoChange: (valor: string) => void;
  onAprobar: () => void;
  onRechazar: () => void;
}

export function PaymentVerificationCard({
  pago,
  motivo,
  procesando,
  onMotivoChange,
  onAprobar,
  onRechazar,
}: PaymentVerificationCardProps) {
  const receipt = toReceiptViewData(pago);

  return (
    <article className="rounded-xl border border-amber-200 bg-amber-50/40 p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2 text-sm">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-slate-900">{pago.socioNombre}</h3>
            <StatusBadge status="pendiente" label="Pendiente verificación" />
          </div>
          <p className="text-slate-600">
            Cuenta <span className="font-mono">{pago.numeroCuenta}</span>
          </p>
          <p>
            Monto: <strong className="tabular-nums">{formatCurrency(pago.monto)}</strong>
            {' · '}
            Fecha: {formatDate(pago.fecha)}
          </p>
          <p className="font-mono text-xs text-slate-500">
            {pago.comprobante}
            {pago.archivoNombre && ` · ${pago.archivoNombre}`}
          </p>
          <ReceiptViewerButton receipt={receipt} />
        </div>

        <div className="flex min-w-[220px] flex-col gap-2">
          <Input
            placeholder="Motivo de rechazo (opcional)"
            value={motivo}
            onChange={(e) => onMotivoChange(e.target.value)}
          />
          <div className="flex gap-2">
            <ActionButton
              type="button"
              size="sm"
              className="flex-1"
              disabled={procesando}
              onClick={onAprobar}
            >
              Aprobar
            </ActionButton>
            <ActionButton
              type="button"
              size="sm"
              variant="outline"
              className="flex-1"
              disabled={procesando}
              onClick={onRechazar}
            >
              Rechazar
            </ActionButton>
          </div>
        </div>
      </div>
    </article>
  );
}
