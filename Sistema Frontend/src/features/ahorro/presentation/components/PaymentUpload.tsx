import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import { z } from 'zod';
import { ActionButton } from '@shared/ui/atoms/ActionButton';
import { FormField } from '@shared/ui/molecules/FormField';
import { Input } from '@shared/ui/atoms/Input';
import { NavIcon } from '@shared/ui/atoms/NavIcon';
import { useToast } from '@shared/hooks/useToast';
import { useRegistrarAporte } from '@features/cuentas/application/hooks/useRegistrarAporte';

const TIPOS_PERMITIDOS = ['image/png', 'image/jpeg', 'application/pdf'];
const TAMANO_MAXIMO = 5 * 1024 * 1024;

const schema = z.object({
  mes: z.string().regex(/^\d{4}-\d{2}$/, 'Selecciona el mes (YYYY-MM)'),
  monto: z
    .string()
    .min(1, 'Ingresa el monto')
    .refine((v) => /^\d+(\.\d{1,2})?$/.test(v), 'Monto inválido (máx. 2 decimales)')
    .refine((v) => parseFloat(v) > 0, 'El monto debe ser mayor a cero'),
  comprobante: z
    .string()
    .trim()
    .min(1, 'Ingresa el código o referencia del comprobante')
    .max(120, 'Máximo 120 caracteres'),
  referencia: z.string().trim().max(120, 'Máximo 120 caracteres').optional().or(z.literal('')),
  descripcion: z.string().trim().optional().or(z.literal('')),
});

type PaymentFormData = z.infer<typeof schema>;

interface PaymentUploadProps {
  cuentaId: string;
  onRegistered?: () => void | Promise<void>;
  embedded?: boolean;
}

export function PaymentUpload({ cuentaId, onRegistered, embedded = false }: PaymentUploadProps) {
  const toast = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [archivo, setArchivo] = useState<File | null>(null);
  const { registrar, registrando } = useRegistrarAporte();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      mes: new Date().toISOString().slice(0, 7),
      monto: '',
      comprobante: '',
      referencia: '',
      descripcion: '',
    },
  });

  const seleccionarArchivo = (file: File | null) => {
    if (!file) {
      setArchivo(null);
      return;
    }
    const tipoOk = TIPOS_PERMITIDOS.includes(file.type) || /\.(png|jpe?g|pdf)$/i.test(file.name);
    if (!tipoOk) {
      toast.error('Formato no permitido. Usa PNG, JPG o PDF.');
      return;
    }
    if (file.size > TAMANO_MAXIMO) {
      toast.error('El archivo supera el máximo de 5 MB.');
      return;
    }
    setArchivo(file);
  };

  const onSubmit = async (data: PaymentFormData) => {
    if (!archivo) {
      toast.error('Sube el comprobante de tu aporte.');
      return;
    }

    try {
      await registrar({
        cuentaId,
        mes: data.mes,
        monto: parseFloat(data.monto),
        comprobante: data.comprobante.trim(),
        archivo,
        referencia: data.referencia?.trim() || undefined,
        descripcion: data.descripcion?.trim() || undefined,
      });
      toast.success('Aporte registrado. Pendiente de verificación por el contador.');
      reset({
        mes: new Date().toISOString().slice(0, 7),
        monto: '',
        comprobante: '',
        referencia: '',
        descripcion: '',
      });
      setArchivo(null);
      if (fileRef.current) fileRef.current.value = '';
      await onRegistered?.();
    } catch (err) {
      const mensaje = isAxiosError(err)
        ? (err.response?.data as { message?: string })?.message ?? 'No se pudo registrar el aporte.'
        : 'No se pudo registrar el aporte.';
      toast.error(mensaje);
    }
  };

  const form = (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-3">
      <p className="rounded-lg border border-sky-100 bg-sky-50 px-3 py-2 text-xs text-sky-800">
        El aporte quedará <strong>pendiente de verificación</strong> hasta que el contador lo apruebe.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <FormField label="Mes" htmlFor="aporte-mes" required error={errors.mes?.message}>
          <Input id="aporte-mes" type="month" {...register('mes')} />
        </FormField>

        <FormField label="Monto" htmlFor="aporte-monto" required error={errors.monto?.message}>
          <Input
            id="aporte-monto"
            type="number"
            inputMode="decimal"
            step="0.01"
            min={0}
            placeholder="0.00"
            {...register('monto')}
          />
        </FormField>
      </div>

      <FormField
        label="Comprobante"
        htmlFor="aporte-comprobante"
        required
        error={errors.comprobante?.message}
      >
        <Input
          id="aporte-comprobante"
          type="text"
          maxLength={120}
          placeholder="Código o referencia del comprobante"
          {...register('comprobante')}
        />
      </FormField>

      <div className="grid gap-3 sm:grid-cols-2">
        <FormField label="Referencia" htmlFor="aporte-referencia" error={errors.referencia?.message}>
          <Input
            id="aporte-referencia"
            type="text"
            maxLength={120}
            placeholder="Opcional"
            {...register('referencia')}
          />
        </FormField>

        <FormField label="Descripción" htmlFor="aporte-descripcion" error={errors.descripcion?.message}>
          <Input id="aporte-descripcion" type="text" placeholder="Opcional" {...register('descripcion')} />
        </FormField>
      </div>

      <FormField label="Archivo del comprobante" htmlFor="aporte-archivo" required>
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
                <p className="text-[11px] text-slate-400">PNG, JPG o PDF · máx. 5 MB</p>
              </>
            )}
          </div>
          <input
            ref={fileRef}
            id="aporte-archivo"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,image/png,image/jpeg,application/pdf"
            className="sr-only"
            onChange={(e) => seleccionarArchivo(e.target.files?.[0] ?? null)}
          />
        </div>
      </FormField>

      <ActionButton type="submit" fullWidth size="sm" isLoading={registrando}>
        Registrar aporte
      </ActionButton>
    </form>
  );

  if (embedded) return form;
  return <div className="rounded-xl border border-slate-200 bg-white p-4">{form}</div>;
}
