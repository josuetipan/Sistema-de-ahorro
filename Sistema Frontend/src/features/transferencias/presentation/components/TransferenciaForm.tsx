// Formulario de transferencia interna con confirmación en modal
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SectionCard } from '@shared/ui/molecules/SectionCard';
import { FormField } from '@shared/ui/molecules/FormField';
import { FormGrid, FormFooter } from '@shared/ui/molecules/FormGrid';
import { Input } from '@shared/ui/atoms/Input';
import { Select } from '@shared/ui/atoms/Select';
import { TextArea } from '@shared/ui/atoms/TextArea';
import { ActionButton } from '@shared/ui/atoms/ActionButton';
import { ButtonGroup } from '@shared/ui/molecules/ButtonGroup';
import { Modal } from '@shared/ui/molecules/Modal';
import { useToast } from '@shared/hooks/useToast';
import { formatCurrency } from '@shared/lib/formatters';
import { MOCK_CUENTA } from '@shared/data/mockData';

const schema = z.object({
  cuentaDestino: z.string().min(5, 'Ingresa la cuenta destino'),
  monto: z.coerce.number().positive('El monto debe ser mayor a cero'),
  concepto: z.string().min(5, 'Describe el concepto'),
});

type FormData = z.infer<typeof schema>;

export function TransferenciaForm() {
  const toast = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pending, setPending] = useState<FormData | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onValid = (data: FormData) => {
    setPending(data);
    setConfirmOpen(true);
  };

  const confirmar = async () => {
    if (!pending) return;
    await new Promise((r) => setTimeout(r, 400));
    toast.success(`Transferencia de ${formatCurrency(pending.monto)} enviada (demo).`);
    setConfirmOpen(false);
    setPending(null);
    reset();
  };

  return (
    <>
      <SectionCard title="Transferencia interna" subtitle={`Cuenta origen: ${MOCK_CUENTA.numeroCuenta}`}>
        <form onSubmit={handleSubmit(onValid)} className="space-y-5" noValidate>
          <FormGrid columns={3}>
            <FormField
              label="Cuenta destino"
              htmlFor="cuentaDestino"
              error={errors.cuentaDestino?.message}
              required
              layout="grid"
            >
              <Input placeholder="AH-2026-…" hasError={!!errors.cuentaDestino} {...register('cuentaDestino')} />
            </FormField>
            <FormField label="Monto" htmlFor="monto" error={errors.monto?.message} required layout="grid">
              <Input type="number" inputMode="decimal" hasError={!!errors.monto} {...register('monto')} />
            </FormField>
            <FormField label="Tipo" htmlFor="tipo" layout="grid">
              <Select name="tipo" defaultValue="interna" disabled>
                <option value="interna">Transferencia interna</option>
              </Select>
            </FormField>
          </FormGrid>
          <FormField label="Concepto" htmlFor="concepto" error={errors.concepto?.message} required layout="grid">
            <TextArea rows={2} hasError={!!errors.concepto} {...register('concepto')} />
          </FormField>
          <FormFooter>
            <ActionButton type="submit" isLoading={isSubmitting} className="w-full sm:w-auto sm:min-w-[10rem]">
              Continuar
            </ActionButton>
          </FormFooter>
        </form>
      </SectionCard>

      <Modal isOpen={confirmOpen} onClose={() => setConfirmOpen(false)} title="Confirmar transferencia">
        {pending && (
          <div className="space-y-4">
            <p className="text-sm leading-relaxed text-gray-600">
              Vas a transferir <strong className="tabular-nums">{formatCurrency(pending.monto)}</strong> a la
              cuenta <span className="font-mono text-gray-800">{pending.cuentaDestino}</span>.
            </p>
            <p className="text-sm text-gray-500">{pending.concepto}</p>
            <ButtonGroup align="end" className="border-t border-gray-100 pt-4">
              <ActionButton type="button" variant="outline" onClick={() => setConfirmOpen(false)}>
                Cancelar
              </ActionButton>
              <ActionButton type="button" onClick={confirmar}>
                Confirmar transferencia
              </ActionButton>
            </ButtonGroup>
          </div>
        )}
      </Modal>
    </>
  );
}
