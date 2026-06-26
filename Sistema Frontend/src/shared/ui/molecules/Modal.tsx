// Modal accesible: overlay + diálogo
import { useEffect, useId, type ReactNode } from 'react';
import { Button } from '../atoms/Button';
import { NavIcon } from '../atoms/NavIcon';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  /** sm | md (default) | lg */
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

const sizeMap = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
};

export function Modal({ isOpen, onClose, title, size = 'md', children }: ModalProps) {
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overscroll-contain p-4 animate-fade-in"
      role="presentation"
    >
      {/* Overlay */}
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="Cerrar diálogo"
      />

      {/* Diálogo */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        className={[
          'relative z-10 w-full rounded-xl border border-slate-200 bg-white',
          'shadow-lg animate-slide-up',
          sizeMap[size],
        ].join(' ')}
      >
        {/* Cabecera */}
        {title && (
          <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4">
            <h2
              id={titleId}
              className="text-base font-semibold text-slate-900"
            >
              {title}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              aria-label="Cerrar"
              className="h-7 w-7 shrink-0 p-0"
            >
              <NavIcon name="arrow-right" size={14} className="rotate-[135deg]" />
            </Button>
          </div>
        )}

        {/* Contenido */}
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
