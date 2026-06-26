// Componentes UI de la entidad usuario: UsuarioCard y AvatarUsuario
import { Card } from '@shared/ui/molecules/Card';
import { Avatar } from '@shared/ui/atoms/Avatar';
import type { Usuario } from '../model';

export function UsuarioCard({ usuario }: { usuario: Usuario }) {
  return (
    <Card title={usuario.nombre} subtitle={usuario.email}>
      <BadgeRol rol={usuario.rol} />
    </Card>
  );
}

function BadgeRol({ rol }: { rol: Usuario['rol'] }) {
  return <span className="text-sm capitalize text-gray-500">{rol}</span>;
}

export function AvatarUsuario({ usuario }: { usuario: Usuario }) {
  return <Avatar name={usuario.nombre} size="md" />;
}
