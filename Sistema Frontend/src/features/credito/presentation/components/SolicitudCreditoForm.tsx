import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { useState } from 'react';

import { FormField } from '@shared/ui/molecules/FormField';

import { FormGrid, FormFooter } from '@shared/ui/molecules/FormGrid';

import { SectionCard } from '@shared/ui/molecules/SectionCard';

import { Input } from '@shared/ui/atoms/Input';

import { DocumentUpload, createDocumentEntry, type UploadedDocument } from '@shared/ui/molecules/DocumentUpload';

import { Select } from '@shared/ui/atoms/Select';

import { TextArea } from '@shared/ui/atoms/TextArea';

import { ActionButton } from '@shared/ui/atoms/ActionButton';

import { useToast } from '@shared/hooks/useToast';

import { formatCurrency } from '@shared/lib/formatters';

import {

  solicitarCreditoSchema,

  type SolicitarCreditoFormData,

} from '../../application/schemas/solicitar-credito.schema';

import { calcularCuotaMensual, TIPOS_CREDITO } from '../../domain/credito.rules';

import { useSolicitarCredito } from '../hooks/useSolicitarCredito';

import { SimuladorCredito } from './SimuladorCredito';



export function SolicitudCreditoForm() {

  const toast = useToast();

  const { solicitar, isSubmitting } = useSolicitarCredito();

  const [archivos, setArchivos] = useState<UploadedDocument[]>([]);

  const [formaPago, setFormaPago] = useState('Débito automático');

  const [aceptaTerminos, setAceptaTerminos] = useState(false);



  const {

    register,

    handleSubmit,

    watch,

    setFocus,

    formState: { errors },

  } = useForm<SolicitarCreditoFormData>({

    resolver: zodResolver(solicitarCreditoSchema),

    defaultValues: {

      monto: 10000,

      plazoMeses: 12,

      tipoCredito: 'Personal',

      ingresos: 15000,

      motivo: '',

    },

  });



  const monto = watch('monto');

  const plazo = watch('plazoMeses');

  const cuotaEstimada = calcularCuotaMensual(Number(monto) || 0, Number(plazo) || 0);



  const onSubmit = async (data: SolicitarCreditoFormData) => {

    if (!aceptaTerminos) {

      toast.error('Debes aceptar términos y condiciones para continuar.');

      return;

    }

    try {

      await solicitar(data);

      toast.success(

        `Tu solicitud fue enviada correctamente por ${formatCurrency(data.monto)}. Estado actual: En revisión.`,

      );

    } catch (error) {

      toast.error(error instanceof Error ? error.message : 'No se pudo enviar la solicitud.');

    }

  };



  const onError = () => {

    const fields = ['monto', 'plazoMeses', 'motivo', 'tipoCredito', 'ingresos'] as const;

    const first = fields.find((f) => errors[f]);

    if (first) setFocus(first);

  };



  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setArchivos((prev) => [...prev, ...Array.from(files).map(createDocumentEntry)]);
    e.target.value = '';
  };



  return (

    <form onSubmit={handleSubmit(onSubmit, onError)} className="flex flex-col gap-5" noValidate>

      <SectionCard title="Datos de la solicitud">

        <FormGrid columns={3} className="mb-4">

          <FormField label="Monto solicitado" htmlFor="monto" error={errors.monto?.message} required layout="grid">

            <Input

              type="number"

              inputMode="decimal"

              autoComplete="off"

              min={1}

              hasError={!!errors.monto}

              {...register('monto')}

            />

          </FormField>

          <FormField label="Plazo (meses)" htmlFor="plazoMeses" error={errors.plazoMeses?.message} required layout="grid">

            <Input

              type="number"

              inputMode="numeric"

              autoComplete="off"

              min={3}

              max={60}

              hasError={!!errors.plazoMeses}

              {...register('plazoMeses')}

            />

          </FormField>

          <FormField label="Tipo de crédito" htmlFor="tipoCredito" error={errors.tipoCredito?.message} required layout="grid">

            <Select hasError={!!errors.tipoCredito} {...register('tipoCredito')}>

              {TIPOS_CREDITO.map((t) => (

                <option key={t} value={t}>

                  {t}

                </option>

              ))}

            </Select>

          </FormField>

        </FormGrid>



        <FormField label="Motivo del crédito" htmlFor="motivo" error={errors.motivo?.message} required layout="grid">

          <TextArea

            rows={3}

            placeholder="Describe el uso del crédito…"

            hasError={!!errors.motivo}

            {...register('motivo')}

          />

        </FormField>



        <FormGrid columns={2} className="mt-4">
          <FormField label="Ingresos mensuales" htmlFor="ingresos" error={errors.ingresos?.message} required layout="grid">
            <Input type="number" inputMode="decimal" hasError={!!errors.ingresos} {...register('ingresos')} />
          </FormField>
        </FormGrid>

        <FormField label="Documentos adjuntos" htmlFor="documentos" layout="grid" className="mt-4">
          <DocumentUpload
            id="documentos"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            buttonLabel="Subir documentos"
            documents={archivos}
            onChange={onFileChange}
            onView={(doc) => toast.show(`Vista previa de ${doc.name} (demo).`, 'info')}
            onRemove={(docId) => setArchivos((prev) => prev.filter((item) => item.id !== docId))}
          />
        </FormField>



        <FormField label="Forma de pago preferida" htmlFor="formaPago" layout="grid" className="mt-4">
          <Select name="formaPago" value={formaPago} onChange={(e) => setFormaPago(e.target.value)}>
            <option>Débito automático</option>
            <option>Transferencia bancaria</option>
            <option>Pago en ventanilla</option>
          </Select>
        </FormField>

        <div className="mt-4 flex justify-center px-1">
          <label
            htmlFor="aceptaTerminos"
            className="field-choice min-h-11 w-full max-w-xl items-center justify-center gap-2.5 rounded-2xl border-gray-200 bg-gray-50/80 px-5 py-3 sm:w-auto"
          >
            <input
              id="aceptaTerminos"
              name="aceptaTerminos"
              type="checkbox"
              className="mt-0 shrink-0"
              checked={aceptaTerminos}
              onChange={(e) => setAceptaTerminos(e.target.checked)}
            />
            <span className="text-center text-sm leading-snug text-gray-700">
              Acepto términos y condiciones del crédito.
            </span>
          </label>
        </div>

      </SectionCard>



      <SimuladorCredito monto={Number(monto) || 0} plazoMeses={Number(plazo) || 0} cuota={cuotaEstimada} />



      <FormFooter className="border-0 pt-0">

        <ActionButton type="submit" fullWidth className="sm:w-auto sm:min-w-[12rem]" isLoading={isSubmitting}>

          Enviar solicitud

        </ActionButton>

      </FormFooter>

    </form>

  );

}

