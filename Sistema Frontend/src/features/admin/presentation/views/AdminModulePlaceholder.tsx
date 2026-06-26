import { SectionCard } from '@shared/ui/molecules/SectionCard';

interface AdminModulePlaceholderProps {
  message?: string;
}

export function AdminModulePlaceholder({
  message = 'Este módulo estará disponible cuando se conecte con el backend.',
}: AdminModulePlaceholderProps) {
  return (
    <SectionCard title="En desarrollo">
      <p className="text-sm leading-relaxed text-gray-500">{message}</p>
    </SectionCard>
  );
}
