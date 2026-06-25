// Átomo: indicador de carga animado
export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

const sizes = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' };

export function Spinner({ size = 'md' }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Cargando"
      className={`animate-spin rounded-full border-2 border-primary-600 border-t-transparent ${sizes[size]}`}
    />
  );
}
