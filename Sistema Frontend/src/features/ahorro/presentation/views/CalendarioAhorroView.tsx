import { useState } from 'react';
import { ActionButton } from '@shared/ui/atoms/ActionButton';
import { useCuentaActiva } from '@shared/hooks/useCuentaActiva';
import { CalendarioMetaCard } from '@features/ahorro/presentation/components/CalendarioMetaCard';

export function CalendarioAhorroView() {
  const { cuentaActiva } = useCuentaActiva();
  const [anio, setAnio] = useState(new Date().getFullYear());

  if (!cuentaActiva) return null;

  const yearNav = (
    <div className="flex gap-2">
      <ActionButton
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setAnio((y) => y - 1)}
        disabled={anio <= 2020}
      >
        ← {anio - 1}
      </ActionButton>
      <ActionButton
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setAnio((y) => y + 1)}
        disabled={anio >= new Date().getFullYear()}
      >
        {anio + 1} →
      </ActionButton>
    </div>
  );

  return <CalendarioMetaCard anio={anio} actions={yearNav} />;
}
