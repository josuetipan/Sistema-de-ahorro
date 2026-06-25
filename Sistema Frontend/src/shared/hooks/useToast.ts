// Hook para mostrar notificaciones toast en la interfaz
export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

export { useToastContext as useToast } from '@/app/providers/ToastProvider';
