import { useState } from 'react';
import { SectionCard } from '@shared/ui/molecules/SectionCard';
import { useToast } from '@shared/hooks/useToast';
import { useAuth } from '@shared/hooks/useAuth';
import { usePagosAhorro } from '../../application/hooks/usePagosAhorro';
import { pagoAhorroMockRepository } from '../../infrastructure/adapters/pago-ahorro-mock.adapter';
import { PaymentVerificationCard } from './PaymentVerificationCard';

export function AdminVerificationPanel() {
  const toast = useToast();
  const { user } = useAuth();
  const [motivos, setMotivos] = useState<Record<string, string>>({});
  const [procesando, setProcesando] = useState<string | null>(null);

  const contadorNombre = user?.nombre ?? 'Contador';
  const { pendientes, cargando, aprobar, rechazar } = usePagosAhorro({
    repository: pagoAhorroMockRepository,
  });

  const handleAprobar = async (pagoId: string) => {
    setProcesando(pagoId);
    try {
      await aprobar(pagoId, contadorNombre);
      toast.success('Pago verificado. El saldo disponible del socio se actualizó.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'No se pudo aprobar el pago.');
    } finally {
      setProcesando(null);
    }
  };

  const handleRechazar = async (pagoId: string) => {
    setProcesando(pagoId);
    try {
      await rechazar(pagoId, contadorNombre, motivos[pagoId]);
      toast.success('Pago rechazado.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'No se pudo rechazar el pago.');
    } finally {
      setProcesando(null);
    }
  };

  return (
    <SectionCard
      title="Pagos pendientes de verificación"
      subtitle="Solo el contador puede aprobar o rechazar pagos. Los aprobados suman al saldo disponible."
    >
      {cargando ? (
        <p className="py-8 text-center text-sm text-slate-500">Cargando pagos pendientes…</p>
      ) : pendientes.length === 0 ? (
        <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50 py-8 text-center text-sm text-slate-500">
          No hay pagos pendientes de verificación.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {pendientes.map((pago) => (
            <PaymentVerificationCard
              key={pago.id}
              pago={pago}
              motivo={motivos[pago.id] ?? ''}
              procesando={procesando === pago.id}
              onMotivoChange={(valor) =>
                setMotivos((prev) => ({ ...prev, [pago.id]: valor }))
              }
              onAprobar={() => void handleAprobar(pago.id)}
              onRechazar={() => void handleRechazar(pago.id)}
            />
          ))}
        </div>
      )}
    </SectionCard>
  );
}
