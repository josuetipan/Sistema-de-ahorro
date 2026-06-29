import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ActionButton } from '@shared/ui/atoms/ActionButton';
import { Input } from '@shared/ui/atoms/Input';
import { FormField } from '@shared/ui/molecules/FormField';
import { NavIcon, type NavIconName } from '@shared/ui/atoms/NavIcon';
import {
  COLORES_CUENTA,
  ICONOS_CUENTA,
  crearCuentaSchema,
  type CrearCuentaFormData,
} from '../../application/schemas/crear-cuenta.schema';
import type { CrearCuentaInput } from '../../domain/cuenta.entity';

interface CrearCuentaFormProps {
  onSubmit: (input: CrearCuentaInput) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export function CrearCuentaForm({ onSubmit, onCancel, isSubmitting = false }: CrearCuentaFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CrearCuentaFormData>({
    resolver: zodResolver(crearCuentaSchema),
    defaultValues: {
      nombre: '',
      color: COLORES_CUENTA[0].value,
      icono: ICONOS_CUENTA[0].value,
    },
  });

  const submit = (data: CrearCuentaFormData) => {
    onSubmit({
      nombre: data.nombre.trim(),
      tipo: 'ahorro',
      moneda: 'USD',
      color: data.color,
      icono: data.icono,
    });
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-5" noValidate>
      <FormField label="Nombre de la cuenta" htmlFor="nombre-cuenta" error={errors.nombre?.message} required>
        <Input
          id="nombre-cuenta"
          placeholder="Ej. Ahorro vacaciones, Educación…"
          hasError={!!errors.nombre}
          {...register('nombre')}
        />
      </FormField>

      <FormField label="Color" htmlFor="color-cuenta" error={errors.color?.message}>
        <Controller
          control={control}
          name="color"
          render={({ field }) => (
            <div className="flex gap-3" id="color-cuenta">
              {COLORES_CUENTA.map((c) => {
                const seleccionado = field.value === c.value;
                return (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => field.onChange(c.value)}
                    aria-label={c.label}
                    aria-pressed={seleccionado}
                    className={[
                      'h-9 w-9 rounded-full ring-2 ring-offset-2 motion-safe-transition focus-visible:outline-none focus-visible:ring-emerald-500',
                      seleccionado ? 'ring-slate-700' : 'ring-transparent hover:ring-slate-300',
                    ].join(' ')}
                    style={{ backgroundColor: c.value }}
                  />
                );
              })}
            </div>
          )}
        />
      </FormField>

      <FormField label="Icono" htmlFor="icono-cuenta" error={errors.icono?.message}>
        <Controller
          control={control}
          name="icono"
          render={({ field }) => (
            <div className="flex gap-3" id="icono-cuenta">
              {ICONOS_CUENTA.map((ic) => {
                const seleccionado = field.value === ic.value;
                return (
                  <button
                    key={ic.value}
                    type="button"
                    onClick={() => field.onChange(ic.value)}
                    aria-label={ic.label}
                    aria-pressed={seleccionado}
                    className={[
                      'flex h-10 w-10 items-center justify-center rounded-xl ring-1 motion-safe-transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500',
                      seleccionado
                        ? 'bg-emerald-50 text-emerald-700 ring-emerald-300'
                        : 'bg-white text-slate-500 ring-slate-200 hover:ring-slate-300',
                    ].join(' ')}
                  >
                    <NavIcon name={ic.value as NavIconName} size={20} />
                  </button>
                );
              })}
            </div>
          )}
        />
      </FormField>

      <div className="flex gap-2 pt-1">
        {onCancel && (
          <ActionButton type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </ActionButton>
        )}
        <ActionButton type="submit" isLoading={isSubmitting}>
          Crear y abrir
        </ActionButton>
      </div>
    </form>
  );
}
