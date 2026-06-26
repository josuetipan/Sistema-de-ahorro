// Átomo: separador horizontal u vertical entre secciones
export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function Divider({ orientation = 'horizontal', className = '' }: DividerProps) {
  return (
    <hr
      className={
        orientation === 'horizontal'
          ? `my-4 w-full border-0 border-t border-slate-200 ${className}`
          : `mx-4 h-full w-px border-0 border-l border-slate-200 ${className}`
      }
    />
  );
}
