import { useState } from 'react';
import { ActionButton } from '@shared/ui/atoms/ActionButton';
import { Input } from '@shared/ui/atoms/Input';
import { TextArea } from '@shared/ui/atoms/TextArea';
import { FormField } from '@shared/ui/molecules/FormField';
import { TabbedContentShell } from '@shared/ui/molecules/TabbedContentShell';
import { useToast } from '@shared/hooks/useToast';
import { formatCurrency } from '@shared/lib/formatters';
import { MOCK_CONFIG, type ConfigCooperativa } from '@shared/data/adminMockData';

export function AdminConfiguracionView() {
  const toast = useToast();
  const [tab, setTab] = useState('ahorro');
  const [config, setConfig] = useState<ConfigCooperativa>(MOCK_CONFIG);

  const guardar = () => {
    toast.success('Configuración guardada (demo). La meta mensual se aplicará a nuevas cuentas.');
  };

  return (
    <div className="flex flex-col gap-5">
      <TabbedContentShell
        tabs={[
          { id: 'ahorro', label: 'Meta de ahorro' },
          { id: 'cooperativa', label: 'Cooperativa' },
          { id: 'tasas', label: 'Tasas' },
          { id: 'general', label: 'Parámetros' },
        ]}
        activeTab={tab}
        onTabChange={setTab}
        ariaLabel="Configuración"
      >
        {tab === 'ahorro' && (
          <div className="flex flex-col gap-4">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
              <p className="text-sm font-medium text-emerald-800">Meta de ahorro mensual</p>
              <p className="mt-1 text-xs text-emerald-700/80">
                Monto mínimo que cada socio debe aportar mensualmente. Los usuarios verán esta meta
                en su dashboard y calendario de aportes.
              </p>
            </div>
            <FormField label="Meta mensual por socio ($)" htmlFor="cfg-meta-mensual" required>
              <Input
                id="cfg-meta-mensual"
                type="number"
                min={1}
                step="1"
                value={config.metaAhorroMensual}
                onChange={(e) => setConfig({ ...config, metaAhorroMensual: Number(e.target.value) })}
              />
            </FormField>
            <p className="text-sm text-slate-500">
              Vista previa: cada socio deberá aportar al menos{' '}
              <strong className="text-slate-700">{formatCurrency(config.metaAhorroMensual)}</strong>{' '}
              al mes para cumplir su meta.
            </p>
          </div>
        )}

        {tab === 'cooperativa' && (
          <div className="flex flex-col gap-4">
            <FormField label="Nombre" htmlFor="cfg-nombre">
              <Input id="cfg-nombre" value={config.nombre} onChange={(e) => setConfig({ ...config, nombre: e.target.value })} />
            </FormField>
            <FormField label="RFC" htmlFor="cfg-rfc">
              <Input id="cfg-rfc" value={config.rfc} onChange={(e) => setConfig({ ...config, rfc: e.target.value })} />
            </FormField>
            <FormField label="Teléfono" htmlFor="cfg-tel">
              <Input id="cfg-tel" value={config.telefono} onChange={(e) => setConfig({ ...config, telefono: e.target.value })} />
            </FormField>
            <FormField label="Dirección" htmlFor="cfg-dir">
              <TextArea id="cfg-dir" rows={2} value={config.direccion} onChange={(e) => setConfig({ ...config, direccion: e.target.value })} />
            </FormField>
          </div>
        )}

        {tab === 'tasas' && (
          <div className="flex flex-col gap-4">
            <FormField label="Rendimiento ahorro anual (%)" htmlFor="cfg-tasa-ahorro">
              <Input id="cfg-tasa-ahorro" type="number" step="0.01" value={config.tasaAhorroAnual * 100} onChange={(e) => setConfig({ ...config, tasaAhorroAnual: Number(e.target.value) / 100 })} />
            </FormField>
          </div>
        )}

        {tab === 'general' && (
          <div className="flex flex-col gap-4">
            <FormField label="Plazo mínimo (meses)" htmlFor="cfg-plazo-min">
              <Input id="cfg-plazo-min" type="number" min={1} value={config.plazoMinimoMeses} onChange={(e) => setConfig({ ...config, plazoMinimoMeses: Number(e.target.value) })} />
            </FormField>
            <FormField label="Plazo máximo (meses)" htmlFor="cfg-plazo-max">
              <Input id="cfg-plazo-max" type="number" min={1} value={config.plazoMaximoMeses} onChange={(e) => setConfig({ ...config, plazoMaximoMeses: Number(e.target.value) })} />
            </FormField>
          </div>
        )}
      </TabbedContentShell>

      <div className="flex justify-end">
        <ActionButton type="button" onClick={guardar}>Guardar configuración</ActionButton>
      </div>
    </div>
  );
}
