import { ActionButton } from '@shared/ui/atoms/ActionButton';
import { SectionCard } from '@shared/ui/molecules/SectionCard';
import { NavIcon } from '@shared/ui/atoms/NavIcon';
import { useCuentaActiva } from '@shared/hooks/useCuentaActiva';
import { useToast } from '@shared/hooks/useToast';
import { isAxiosError } from 'axios';
import { useCrearCuenta } from '../../application/hooks/useCrearCuenta';
import { cuentaCreadaToCuentaUsuario } from '../../infrastructure/mappers/cuenta.mapper';
import type { CrearCuentaInput } from '../../domain/cuenta.entity';
import { CrearCuentaForm } from './CrearCuentaForm';

interface AgregarCuentaPanelProps {
  onClose: () => void;
  onCreated?: () => void;
}

function getCrearErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const msg = error.response?.data as { message?: string } | undefined;
    if (msg?.message) return msg.message;
  }
  return 'No se pudo crear la cuenta. Inténtalo de nuevo.';
}

export function AgregarCuentaPanel({ onClose, onCreated }: AgregarCuentaPanelProps) {
  const toast = useToast();
  const { agregarCuenta } = useCuentaActiva();
  const { crearCuenta, isSubmitting } = useCrearCuenta();

  const onSubmit = async (input: CrearCuentaInput) => {
    try {
      const creada = await crearCuenta(input);
      agregarCuenta(cuentaCreadaToCuentaUsuario(creada));
      toast.success(`Cuenta "${creada.nombre}" creada correctamente.`);
      onClose();
      onCreated?.();
    } catch (err) {
      toast.error(getCrearErrorMessage(err));
    }
  };

  return (
    <SectionCard title="Nueva cuenta de ahorro" subtitle="Personaliza tu nueva cuenta de ahorro.">
      <CrearCuentaForm onSubmit={onSubmit} onCancel={onClose} isSubmitting={isSubmitting} />
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
