import { useEffect, useState } from 'react';
import { ActionButton } from '@shared/ui/atoms/ActionButton';
import { Input } from '@shared/ui/atoms/Input';
import { FormField } from '@shared/ui/molecules/FormField';
import { useToast } from '@shared/hooks/useToast';
import { formatCurrency, formatDate } from '@shared/lib/formatters';
import type { ConfiguracionMetaAhorro } from '@features/ahorro/domain/ahorro.entity';
import {
  getMetaAhorroAdmin,
  patchMetaAhorroAdmin,
} from '../../infrastructure/api/admin-ahorro.api';

interface MetaForm {
  metaMensual: string;
  metaMinima: string;
  metaMaxima: string;
}

const EMPTY_FORM: MetaForm = {
  metaMensual: '',
  metaMinima: '',
  metaMaxima: '',
};

function toForm(meta: ConfiguracionMetaAhorro): MetaForm {
  return {
    metaMensual: String(meta.metaMensual),
    metaMinima: String(meta.metaMinima),
    metaMaxima: String(meta.metaMaxima),
  };
}

export function AdminConfiguracionView() {
  const toast = useToast();
  const [meta, setMeta] = useState<ConfiguracionMetaAhorro | null>(null);
  const [form, setForm] = useState<MetaForm>(EMPTY_FORM);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function cargarMeta() {
      setCargando(true);
      setError(null);
      try {
        const data = await getMetaAhorroAdmin();
        if (!mounted) return;
        setMeta(data);
        setForm(toForm(data));
      } catch {
        if (!mounted) return;
        setError('No se pudo cargar la configuracion de meta.');
      } finally {
        if (mounted) setCargando(false);
      }
    }

    void cargarMeta();
    return () => {
      mounted = false;
    };
  }, []);

  const metaMensual = Number(form.metaMensual);
  const metaMinima = Number(form.metaMinima);
  const metaMaxima = Number(form.metaMaxima);
  const valoresValidos =
    Number.isFinite(metaMensual) &&
    Number.isFinite(metaMinima) &&
    Number.isFinite(metaMaxima) &&
    metaMensual > 0 &&
    metaMinima > 0 &&
    metaMaxima > 0 &&
    metaMinima <= metaMensual &&
    metaMensual <= metaMaxima;

  const guardar = async () => {
    if (!valoresValidos) {
      toast.error('Verifica que minima <= mensual <= maxima y que todos los valores sean mayores a cero.');
      return;
    }

    setGuardando(true);
    try {
      const data = await patchMetaAhorroAdmin({
        metaMensual,
        metaMinima,
        metaMaxima,
      });
      setMeta(data);
      setForm(toForm(data));
      toast.success('Meta de ahorro actualizada.');
    } catch {
      toast.error('No se pudo actualizar la meta de ahorro.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="max-w-3xl rounded-lg border border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-5 py-4">
        <p className="text-sm font-semibold text-slate-900">Meta de ahorro</p>
        <p className="mt-1 text-sm text-slate-500">
          Configura los valores que usara el sistema para validar los aportes mensuales.
        </p>
      </div>

      <div className="p-5">
        {cargando ? (
          <p className="text-sm text-slate-500">Cargando configuracion...</p>
        ) : error ? (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-3">
              <FormField label="Meta minima" htmlFor="cfg-meta-minima" required>
                <Input
                  id="cfg-meta-minima"
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.metaMinima}
                  onChange={(event) => setForm((current) => ({
                    ...current,
                    metaMinima: event.target.value,
                  }))}
                />
              </FormField>

              <FormField label="Meta mensual" htmlFor="cfg-meta-mensual" required>
                <Input
                  id="cfg-meta-mensual"
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.metaMensual}
                  onChange={(event) => setForm((current) => ({
                    ...current,
                    metaMensual: event.target.value,
                  }))}
                />
              </FormField>

              <FormField label="Meta maxima" htmlFor="cfg-meta-maxima" required>
                <Input
                  id="cfg-meta-maxima"
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.metaMaxima}
                  onChange={(event) => setForm((current) => ({
                    ...current,
                    metaMaxima: event.target.value,
                  }))}
                />
              </FormField>
            </div>

            <div className="mt-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              
              {meta?.updatedAt && (
                <p className="mt-1 text-xs text-slate-500">
                  Ultima actualizacion: {formatDate(meta.updatedAt)}
                </p>
              )}
            </div>

            <div className="mt-5 flex justify-end">
              <ActionButton
                type="button"
                onClick={guardar}
                disabled={!valoresValidos || guardando}
                isLoading={guardando}
              >
                Guardar meta
              </ActionButton>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
