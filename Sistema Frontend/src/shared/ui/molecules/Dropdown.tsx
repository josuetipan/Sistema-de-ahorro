// Molécula: menú desplegable de opciones
import { useState } from 'react';
import { Button } from '../atoms/Button';

export interface DropdownOption {
  label: string;
  value: string;
}

export interface DropdownProps {
  options: DropdownOption[];
  onSelect: (value: string) => void;
  label?: string;
}

export function Dropdown({ options, onSelect, label = 'Seleccionar' }: DropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <Button variant="outline" onClick={() => setOpen(!open)}>
        {label}
      </Button>
      {open && (
        <ul className="absolute left-0 z-10 mt-1 min-w-[160px] rounded-lg border bg-white py-1 shadow-lg">
          {options.map((opt) => (
            <li key={opt.value}>
              <button
                type="button"
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                onClick={() => {
                  onSelect(opt.value);
                  setOpen(false);
                }}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
