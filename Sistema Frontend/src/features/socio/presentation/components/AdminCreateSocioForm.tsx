import { useEffect, useState } from 'react';
import { Input } from '@shared/ui/atoms/Input';
import { Button } from '@shared/ui/atoms/Button';
import { ActionButton } from '@shared/ui/atoms/ActionButton';
import { FormField } from '@shared/ui/molecules/FormField';
import type { CrearSocioInput, Socio } from '../../domain/socio.entity';
import type { ValidacionCodigoReferencia } from '../../domain/socio.entity';
import { crearSocioAdminSchema } from '../../application/schemas/registro-socio.schema';

export interface AdminSocioFormValues {
  nombres: string;
  cedula: string;
  email: string;
  telefono: string;
  codigoReferenciaIngresado: string;
}

const EMPTY_FORM: AdminSocioFormValues = {
  nombres: '',
  cedula: '',
  email: '',
  telefono: '',
  codigoReferenciaIngresado: '',
};

interface AdminCreateSocioFormProps {
  modo: 'crear' | 'editar';
  socio?: Socio | null;
  onSubmit: (values: CrearSocioInput) => Promise<void>;
  onCancel: () => void;
  validarCodigoReferencia: (
    codigo: string,
    opciones?: { excluirSocioId?: string; obligatorio?: boolean },
  ) => ValidacionCodigoReferencia;
}

export function AdminCreateSocioForm({
  modo,
  socio,
  onSubmit,
  onCancel,
  validarCodigoReferencia,
}: AdminCreateSocioFormProps) {
  const [form, setForm] = useState<AdminSocioFormValues>(EMPTY_FORM);
  const [errores, setErrores] = useState<Partial<Record<keyof AdminSocioFormValues, string>>>({});
  const [guardando, setGuardando] = useState(false);
  const [referidorNombre, setReferidorNombre] = useState<string | null>(null);

  useEffect(() => {
    if (modo === 'editar' && socio) {
      setForm({
        nombres: socio.nombres,
        cedula: socio.cedula,
        email: socio.email,
        telefono: socio.telefono,
        codigoReferenciaIngresado: '',
      });
      setErrores({});
      setReferidorNombre(null);
      return;
    }

    setForm(EMPTY_FORM);
    setErrores({});
    setReferidorNombre(null);
  }, [modo, socio]);

  const actualizarCampo = (campo: keyof AdminSocioFormValues, valor: string) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
    setErrores((prev) => ({ ...prev, [campo]: undefined }));

    if (campo === 'codigoReferenciaIngresado') {
      const validacion = validarCodigoReferencia(valor, { excluirSocioId: socio?.id });
      if (!valor.trim()) {
        setReferidorNombre(null);
        return;
      }
      setReferidorNombre(validacion.valido ? (validacion.socioReferidor?.nombres ?? null) : null);
      if (!validacion.valido && valor.trim().length >= 4) {
        setErrores((prev) => ({ ...prev, codigoReferenciaIngresado: validacion.error }));
      }
    }
  };

  const validarFormulario = (): boolean => {
    const parsed = crearSocioAdminSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof AdminSocioFormValues, string>> = {};
      parsed.error.issues.forEach((issue) => {
        const campo = issue.path[0] as keyof AdminSocioFormValues;
        if (!fieldErrors[campo]) fieldErrors[campo] = issue.message;
      });
      setErrores(fieldErrors);
      return false;
    }

    if (modo === 'crear' && form.codigoReferenciaIngresado.trim()) {
      const validacion = validarCodigoReferencia(form.codigoReferenciaIngresado);
      if (!validacion.valido) {
        setErrores((prev) => ({ ...prev, codigoReferenciaIngresado: validacion.error }));
        return false;
      }
    }

    setErrores({});
    return true;
  };

  const handleSubmit = async () => {
    if (!validarFormulario()) return;

    setGuardando(true);
    try {
      await onSubmit({
        nombres: form.nombres,
        cedula: form.cedula,
        email: form.email,
        telefono: form.telefono,
        codigoReferenciaIngresado: form.codigoReferenciaIngresado.trim() || undefined,
      });
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="space-y-4">
      <FormField label="Nombres completos" htmlFor="admin-socio-nombres" required error={errores.nombres}>
        <Input
          id="admin-socio-nombres"
          value={form.nombres}
          onChange={(e) => actualizarCampo('nombres', e.target.value)}
        />
      </FormField>

      <FormField label="Cédula" htmlFor="admin-socio-cedula" required error={errores.cedula}>
        <Input
          id="admin-socio-cedula"
          value={form.cedula}
          onChange={(e) => actualizarCampo('cedula', e.target.value)}
          placeholder="Ej. 1726312745"
        />
      </FormField>

      <FormField label="Correo" htmlFor="admin-socio-email" required error={errores.email}>
        <Input
          id="admin-socio-email"
          type="email"
          value={form.email}
          onChange={(e) => actualizarCampo('email', e.target.value)}
        />
      </FormField>

      <FormField label="Teléfono" htmlFor="admin-socio-tel" required error={errores.telefono}>
        <Input
          id="admin-socio-tel"
          value={form.telefono}
          onChange={(e) => actualizarCampo('telefono', e.target.value)}
        />
      </FormField>

      {modo === 'crear' && (
        <FormField
          label="Código de referencia (opcional)"
          htmlFor="admin-socio-codigo-ref"
          error={errores.codigoReferenciaIngresado}
        >
          <Input
            id="admin-socio-codigo-ref"
            value={form.codigoReferenciaIngresado}
            onChange={(e) => actualizarCampo('codigoReferenciaIngresado', e.target.value.toUpperCase())}
            placeholder="SOC-XXXXXX"
          />
          {referidorNombre && (
            <p className="mt-1 text-[12px] text-green-700">
              Referido por: <span className="font-medium">{referidorNombre}</span>
            </p>
          )}
          <p className="mt-1 text-[11px] text-slate-500">
            Puedes crear el socio sin referencia o asignarla manualmente.
          </p>
        </FormField>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={guardando}>
          Cancelar
        </Button>
        <ActionButton type="button" onClick={() => void handleSubmit()} disabled={guardando}>
          {guardando ? 'Guardando…' : 'Guardar'}
        </ActionButton>
      </div>
    </div>
  );
}
