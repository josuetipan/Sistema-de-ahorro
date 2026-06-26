import { useState } from 'react';
import { ActionButton } from '@shared/ui/atoms/ActionButton';
import { Input } from '@shared/ui/atoms/Input';
import type { SocioResumen } from '../../domain/cuenta-ahorro.entity';

interface SocioSearchProps {
  onBuscar: (termino: string) => Promise<SocioResumen[]>;
  onResultados: (resultados: SocioResumen[]) => void;
  disabled?: boolean;
}

export function SocioSearch({ onBuscar, onResultados, disabled }: SocioSearchProps) {
  const [termino, setTermino] = useState('');
  const [buscando, setBuscando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buscar = async () => {
    if (!termino.trim()) {
      setError('Ingresa una cédula o código de referencia.');
      return;
    }
    setBuscando(true);
    setError(null);
    try {
      const resultados = await onBuscar(termino.trim());
      onResultados(resultados);
      if (resultados.length === 0) {
        setError('No se encontraron socios con ese criterio.');
      }
    } finally {
      setBuscando(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          placeholder="Cédula o código SOC-XXXXXX"
          value={termino}
          onChange={(e) => setTermino(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === 'Enter' && void buscar()}
          disabled={disabled || buscando}
        />
        <ActionButton type="button" onClick={() => void buscar()} disabled={disabled || buscando}>
          {buscando ? 'Buscando…' : 'Buscar'}
        </ActionButton>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
