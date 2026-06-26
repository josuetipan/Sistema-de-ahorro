import { useCallback, useState } from 'react';
import { solicitarCreditoUseCase } from '../../application/use-cases/solicitar-credito.usecase';
import type { SolicitarCreditoFormData } from '../../application/schemas/solicitar-credito.schema';
import { creditoRepository } from '../../infrastructure/adapters';

export function useSolicitarCredito() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const solicitar = useCallback(async (data: SolicitarCreditoFormData) => {
    setIsSubmitting(true);
    try {
      await solicitarCreditoUseCase(creditoRepository, {
        monto: data.monto,
        plazoMeses: data.plazoMeses,
        tipoCredito: data.tipoCredito,
        motivo: data.motivo,
        ingresos: data.ingresos,
      });
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return { solicitar, isSubmitting };
}
