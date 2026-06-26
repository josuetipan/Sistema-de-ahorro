import type { ToastMessage } from '@shared/hooks/useToast';

export interface ToastProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}

const typeStyles: Record<ToastMessage['type'], string> = {
  success: 'bg-blue-700 text-white',
  error: 'bg-red-800 text-white',
  info: 'bg-blue-600 text-white',
  warning: 'bg-amber-700 text-white',
};

export function Toast({ toast, onDismiss }: ToastProps) {
  const isError = toast.type === 'error';

  return (
    <div
      className={`flex min-w-[280px] max-w-md items-center justify-between gap-4 rounded-lg px-4 py-3 shadow-lg ${typeStyles[toast.type]}`}
      role={isError ? 'alert' : 'status'}
      aria-live={isError ? 'assertive' : 'polite'}
    >
      <span className="min-w-0 break-words text-sm leading-snug">{toast.message}</span>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="shrink-0 touch-manipulation rounded p-1 text-white/80 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        aria-label="Cerrar notificación"
      >
        <span aria-hidden="true">✕</span>
      </button>
    </div>
  );
}
