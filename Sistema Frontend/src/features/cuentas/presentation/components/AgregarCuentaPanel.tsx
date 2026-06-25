import { useState } from 'react';
import { ActionButton } from '@shared/ui/atoms/ActionButton';
import { Input } from '@shared/ui/atoms/Input';
import { FormField } from '@shared/ui/molecules/FormField';
import { SectionCard } from '@shared/ui/molecules/SectionCard';
import { NavIcon } from '@shared/ui/atoms/NavIcon';
import { useCuentaActiva } from '@shared/hooks/useCuentaActiva';
import { useToast } from '@shared/hooks/useToast';
import { META_AHORRO_MENSUAL_DEFAULT, type CuentaUsuario } from '@shared/data/ahorroMockData';

interface AgregarCuentaPanelProps {
  onClose: () => void;
  onCreated?: () => void;
}

export function AgregarCuentaPanel({ onClose, onCreated }: AgregarCuentaPanelProps) {
  const toast = useToast();
  const { agregarCuenta, seleccionarCuenta } = useCuentaActiva();
  const [nombreNueva, setNombreNueva] = useState('');

  const crearCuenta = () => {
    if (!nombreNueva.trim()) {
      toast.error('Escribe un nombre para tu cuenta.');
      return;
    }

    const nueva: CuentaUsuario = {
      id: `cta-${Date.now()}`,
      nombre: nombreNueva.trim(),
      numeroCuenta: `AH-2026-${String(Math.floor(Math.random() * 900000) + 100000)}`,
      saldo: 0,
      totalAhorrado: 0,
      metaMensual: META_AHORRO_MENSUAL_DEFAULT,
      color: 'emerald',
      icono: 'savings',
      fechaApertura: new Date().toISOString().split('T')[0],
      estado: 'activa',
    };

    agregarCuenta(nueva);
    seleccionarCuenta(nueva.id);
    toast.success(`Cuenta "${nueva.nombre}" creada.`);
    onClose();
    onCreated?.();
  };

  return (
    <SectionCard title="Nueva cuenta de ahorro" subtitle="Dale un nombre para identificar tu objetivo de ahorro.">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <FormField label="Nombre de la cuenta" htmlFor="nombre-cuenta-nueva" required>
            <Input
              id="nombre-cuenta-nueva"
              placeholder="Ej. Ahorro para casa, Educación…"
              value={nombreNueva}
              onChange={(e) => setNombreNueva(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && crearCuenta()}
            />
          </FormField>
        </div>
        <div className="flex gap-2">
          <ActionButton type="button" variant="outline" size="sm" onClick={onClose}>
            Cancelar
          </ActionButton>
          <ActionButton type="button" size="sm" onClick={crearCuenta}>
            Crear cuenta
          </ActionButton>
        </div>
      </div>
    </SectionCard>
  );
}

interface AgregarCuentaButtonProps {
  onClick: () => void;
  className?: string;
}

export function AgregarCuentaButton({ onClick, className = '' }: AgregarCuentaButtonProps) {
  return (
    <ActionButton type="button" variant="outline" size="sm" onClick={onClick} className={className}>
      <NavIcon name="layers" size={14} />
      Agregar nueva cuenta
    </ActionButton>
  );
}
