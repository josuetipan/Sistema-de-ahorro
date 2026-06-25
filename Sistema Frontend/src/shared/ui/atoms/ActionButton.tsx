import { forwardRef, type ReactNode } from 'react';
import { Button, type ButtonProps } from './Button';

export interface ActionButtonProps extends ButtonProps {
  icon?: ReactNode;
}

/** Botón de acción SaaS con soporte de ícono opcional. */
export const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(
  ({ size = 'md', variant = 'primary', icon, children, ...props }, ref) => (
    <Button ref={ref} size={size} variant={variant} {...props}>
      {icon && <span className="inline-flex shrink-0 items-center">{icon}</span>}
      {children}
    </Button>
  ),
);

ActionButton.displayName = 'ActionButton';
