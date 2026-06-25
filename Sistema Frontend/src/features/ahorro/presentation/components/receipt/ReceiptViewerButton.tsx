import { useState } from 'react';
import { ActionButton } from '@shared/ui/atoms/ActionButton';
import { NavIcon } from '@shared/ui/atoms/NavIcon';
import type { ReceiptViewData } from '../../../domain/receipt.utils';
import { ReceiptModal } from './ReceiptModal';

interface ReceiptViewerButtonProps {
  receipt: ReceiptViewData | null;
  className?: string;
}

export function ReceiptViewerButton({ receipt, className = '' }: ReceiptViewerButtonProps) {
  const [abierto, setAbierto] = useState(false);

  if (!receipt) return null;

  return (
    <>
      <ActionButton
        type="button"
        variant="ghost"
        size="sm"
        className={`h-auto px-0 py-0 text-xs font-medium text-blue-600 hover:bg-transparent hover:text-blue-800 ${className}`}
        icon={<NavIcon name="eye" size={14} />}
        onClick={() => setAbierto(true)}
      >
        Ver comprobante
      </ActionButton>

      <ReceiptModal receipt={abierto ? receipt : null} onClose={() => setAbierto(false)} />
    </>
  );
}
