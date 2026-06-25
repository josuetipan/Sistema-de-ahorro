import { Modal } from '@shared/ui/molecules/Modal';
import { formatDate } from '@shared/lib/formatters';
import type { EmailSimulado } from '../../domain/cuenta-ahorro.entity';

interface EmailSimulationModalProps {
  email: EmailSimulado | null;
  numeroCuenta?: string;
  onClose: () => void;
}

export function EmailSimulationModal({ email, numeroCuenta, onClose }: EmailSimulationModalProps) {
  return (
    <Modal
      isOpen={!!email}
      onClose={onClose}
      title="Cuenta creada exitosamente"
    >
      {email && (
        <div className="space-y-4">
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            <p className="font-semibold">✔ Cuenta creada exitosamente</p>
            <p className="mt-1">
              📧 Las credenciales han sido enviadas al correo del socio
            </p>
            {numeroCuenta && (
              <p className="mt-2 font-mono text-xs text-emerald-700">
                Número de cuenta: {numeroCuenta}
              </p>
            )}
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Simulación de correo (mock)
            </p>
            <dl className="mt-2 space-y-1">
              <div>
                <dt className="text-xs text-slate-500">Para</dt>
                <dd>{email.to}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Asunto</dt>
                <dd>{email.subject}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Cuerpo</dt>
                <dd className="font-mono text-xs">{email.body}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Enviado</dt>
                <dd>{formatDate(email.sentAt)}</dd>
              </div>
            </dl>
          </div>

          <p className="text-[11px] text-slate-500">
            Por seguridad, el usuario y la clave no se muestran en pantalla. Solo se simula el envío
            por correo electrónico.
          </p>
        </div>
      )}
    </Modal>
  );
}
