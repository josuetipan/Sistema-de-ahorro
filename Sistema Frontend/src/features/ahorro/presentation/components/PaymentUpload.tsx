import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ActionButton } from '@shared/ui/atoms/ActionButton';
import { FormField } from '@shared/ui/molecules/FormField';
import { Input } from '@shared/ui/atoms/Input';
import { NavIcon } from '@shared/ui/atoms/NavIcon';
import { useToast } from '@shared/hooks/useToast';
import { formatCurrency } from '@shared/lib/formatters';
import { META_MENSUAL_OBLIGATORIA, type RegistrarPagoInput } from '../../domain/pago.entity';
import { generarComprobantePago } from '../../domain/pago.rules';

const schema = z.object({
  monto: z.coerce.number().min(1, 'El monto debe ser mayor a cero'),
  fecha: z.string().min(1, 'Selecciona la fecha del pago'),
});

type PaymentFormData = z.infer<typeof schema>;

interface PaymentUploadProps {
  cuentaId: string;
  socioNombre: string;
  numeroCuenta: string;
  onRegistrar: (input: RegistrarPagoInput) => Promise<void>;
  embedded?: boolean;
}

export function PaymentUpload({
  cuentaId,
  socioNombre,
  numeroCuenta,
  onRegistrar,
  embedded = false,
}: PaymentUploadProps) {
  const toast = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [archivo, setArchivo] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      monto: META_MENSUAL_OBLIGATORIA,
      fecha: new Date().toISOString().slice(0, 10),
    },
  });

  const onSubmit = async (data: PaymentFormData) => {
    if (!archivo) {
      toast.error('Sube el comprobante de tu pago.');
      return;
    }

    try {
      await onRegistrar({
        cuentaId,
        socioNombre,
        numeroCuenta,
        monto: data.monto,
        fecha: `${data.fecha}T12:00:00`,
        comprobante: generarComprobantePago(),
        archivoNombre: archivo.name,
        comprobanteUrl: URL.createObjectURL(archivo),
      });
      toast.success(
        `Pago de ${formatCurrency(data.monto)} registrado. Pendiente de verificación por el contador.`,
      );
      reset({ monto: META_MENSUAL_OBLIGATORIA, fecha: new Date().toISOString().slice(0, 10) });
      setArchivo(null);
      if (fileRef.current) fileRef.current.value = '';
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'No se pudo registrar el pago.');
    }
  };

  const form = (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-3">
      <p className="rounded-lg border border-sky-100 bg-sky-50 px-3 py-2 text-xs text-sky-800">
        Meta mensual obligatoria: <strong>{formatCurrency(META_MENSUAL_OBLIGATORIA)}</strong>.
        Puedes aportar más como ahorro extra; el excedente no adelanta meses futuros.
        El pago quedará <strong>pendiente de verificación</strong> hasta que el contador lo apruebe.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <FormField label="Monto" htmlFor="pago-monto" required error={errors.monto?.message}>
          <Input
            id="pago-monto"
            type="number"
            inputMode="decimal"
            step="0.01"
            min={1}
            {...register('monto')}
          />
        </FormField>

        <FormField label="Fecha del pago" htmlFor="pago-fecha" required error={errors.fecha?.message}>
          <Input id="pago-fecha" type="date" {...register('fecha')} />
        </FormField>
      </div>

      <FormField label="Comprobante" htmlFor="pago-comprobante" required>
        <div
          className={[
            'flex items-center gap-3 rounded-lg border-2 border-dashed px-4 py-3',
            'motion-safe-transition cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/40',
            archivo ? 'border-emerald-400 bg-emerald-50/30' : 'border-slate-200',
          ].join(' ')}
          onClick={() => fileRef.current?.click()}
          onKeyDown={(e) => e.key === 'Enter' && fileRef.current?.click()}
          role="button"
          tabIndex={0}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <NavIcon name="upload" size={18} />
          </span>
          <div className="min-w-0 text-left">
            {archivo ? (
              <p className="truncate text-sm font-medium text-emerald-700">{archivo.name}</p>
            ) : (
              <>
                <p className="text-sm font-medium text-slate-700">Clic para subir comprobante</p>
                <p className="text-[11px] text-slate-400">PDF, JPG o PNG (simulado)</p>
              </>
            )}
          </div>
          <input
            ref={fileRef}
            id="pago-comprobante"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="sr-only"
            onChange={(e) => setArchivo(e.target.files?.[0] ?? null)}
          />
        </div>
      </FormField>

      <ActionButton type="submit" fullWidth size="sm" isLoading={isSubmitting}>
        Registrar pago
      </ActionButton>
    </form>
  );

  if (embedded) return form;
  return <div className="rounded-xl border border-slate-200 bg-white p-4">{form}</div>;
}
