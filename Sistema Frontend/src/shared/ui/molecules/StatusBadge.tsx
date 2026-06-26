import { Badge } from '../atoms/Badge';

type StatusVariant = 'default' | 'primary' | 'muted' | 'outline' | 'success' | 'warning' | 'danger';

const STATUS_MAP: Record<string, StatusVariant> = {
  activa:          'success',
  activo:          'success',
  aprobado:        'success',
  verificado:      'success',
  completado:      'success',
  pagado:          'success',
  pagada:          'success',
  deposito:        'primary',
  pendiente:       'warning',
  transferencia:   'primary',
  bloqueada:       'danger',
  rechazado:       'danger',
  rechazada:       'danger',
  inactiva:        'muted',
  inactivo:        'muted',
  vencido:         'danger',
  vencida:         'danger',
  retiro:          'default',
};

const DOT_COLORS: Record<StatusVariant, string> = {
  default:  'bg-slate-400',
  primary:  'bg-blue-500',
  success:  'bg-green-500',
  warning:  'bg-amber-500',
  danger:   'bg-red-500',
  muted:    'bg-slate-400',
  outline:  'bg-slate-400',
};

export interface StatusBadgeProps {
  status: string;
  label?: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const key     = status.toLowerCase();
  const variant = STATUS_MAP[key] ?? 'default';
  const text    = label ?? status;

  return (
    <Badge variant={variant}>
      <span
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${DOT_COLORS[variant]}`}
        aria-hidden
      />
      <span className="capitalize">{text}</span>
    </Badge>
  );
}
