import { useNavigate } from 'react-router-dom';
import { ActionButton } from '@shared/ui/atoms/ActionButton';
import { NavIcon } from '@shared/ui/atoms/NavIcon';
import { ROUTES } from '@shared/config/routes';

interface CambiarCuentaActionsProps {
  layout?: 'inline' | 'stacked' | 'sidebar';
  className?: string;
}

export function CambiarCuentaActions({ layout = 'inline', className = '' }: CambiarCuentaActionsProps) {
  const navigate = useNavigate();
  const irAElegirCuenta = () => navigate(ROUTES.ELEGIR_CUENTA);

  if (layout === 'sidebar') {
    return (
      <button
        type="button"
        onClick={irAElegirCuenta}
        title="Cambiar cuenta"
        className={[
          'flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] font-medium',
          'text-emerald-400/90 motion-safe-transition hover:bg-emerald-500/10 hover:text-emerald-300',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500',
          className,
        ].join(' ')}
      >
        <NavIcon name="transfer" size={16} className="shrink-0" />
        <span className="truncate">Cambiar cuenta</span>
      </button>
    );
  }

  return (
    <ActionButton
      type="button"
      variant={layout === 'stacked' ? 'outline' : 'ghost'}
      size="sm"
      fullWidth={layout === 'stacked'}
      onClick={irAElegirCuenta}
      className={className}
    >
      <NavIcon name="transfer" size={14} />
      Cambiar cuenta
    </ActionButton>
  );
}
