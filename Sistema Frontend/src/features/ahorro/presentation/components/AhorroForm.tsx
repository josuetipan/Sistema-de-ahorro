import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SectionCard } from '@shared/ui/molecules/SectionCard';
import { FormField } from '@shared/ui/molecules/FormField';
import { FormGrid } from '@shared/ui/molecules/FormGrid';
import { FormActions } from '@shared/ui/molecules/ButtonGroup';
import { Input } from '@shared/ui/atoms/Input';
import { Select } from '@shared/ui/atoms/Select';
import { ActionButton } from '@shared/ui/atoms/ActionButton';
import { useToast } from '@shared/hooks/useToast';
import { formatCurrency } from '@shared/lib/formatters';

const schema = z.object({
  monto: z.coerce.number().positive('Monto inválido'),
  tipo: z.enum(['deposito', 'retiro']),
});

type FormData = z.infer<typeof schema>;

export function AhorroForm() {
  const toast = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { tipo: 'deposito', monto: 500 },
  });

  const onSubmit = async (data: FormData) => {
    await new Promise((r) => setTimeout(r, 400));
    toast.success(
      `${data.tipo === 'deposito' ? 'Depósito' : 'Retiro'} de ${formatCurrency(data.monto)} registrado (demo).`,
    );
    reset({ tipo: data.tipo, monto: 500 });
  };

  return (
    <SectionCard title="Registrar movimiento">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormGrid columns={3}>
          <FormField label="Tipo" htmlFor="tipo" required layout="grid">
            <Select {...register('tipo')}>
              <option value="deposito">Depósito</option>
              <option value="retiro">Retiro</option>
            </Select>
          </FormField>
          <FormField
            label="Monto"
            htmlFor="monto-ahorro"
            error={errors.monto?.message}
            required
            layout="grid"
          >
            <Input type="number" inputMode="decimal" hasError={!!errors.monto} {...register('monto')} />
          </FormField>
          <FormActions>
            <ActionButton type="submit" fullWidth isLoading={isSubmitting}>
              Registrar
            </ActionButton>
          </FormActions>
        </FormGrid>
      </form>
    </SectionCard>
  );
}
