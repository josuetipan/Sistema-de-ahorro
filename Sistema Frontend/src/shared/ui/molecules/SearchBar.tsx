// Molécula: barra de búsqueda con icono
import { Input } from '../atoms/Input';
import { NavIcon } from '../atoms/NavIcon';

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Buscar…',
  id = 'search',
  className = '',
}: SearchBarProps) {
  return (
    <div className={`relative min-w-0 ${className}`}>
      <label htmlFor={id} className="sr-only">
        Buscar
      </label>
      <Input
        id={id}
        type="search"
        name="search"
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-10"
      />
      <NavIcon
        name="search"
        size={18}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />
    </div>
  );
}
