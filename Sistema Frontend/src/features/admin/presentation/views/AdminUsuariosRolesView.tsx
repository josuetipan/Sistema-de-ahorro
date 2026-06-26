import { useState } from 'react';
import { ActionButton } from '@shared/ui/atoms/ActionButton';
import { Button } from '@shared/ui/atoms/Button';
import { TableActionButton, TableActions } from '@shared/ui/molecules/TableActions';
import { Input } from '@shared/ui/atoms/Input';
import { Select } from '@shared/ui/atoms/Select';
import { FormField } from '@shared/ui/molecules/FormField';
import { Modal } from '@shared/ui/molecules/Modal';
import { SectionCard } from '@shared/ui/molecules/SectionCard';
import { StatusBadge } from '@shared/ui/molecules/StatusBadge';
import { Table, type TableColumn } from '@shared/ui/molecules/Table';
import { useToast } from '@shared/hooks/useToast';
import { formatDate } from '@shared/lib/formatters';
import { MOCK_USUARIOS_SISTEMA, type RolSistema, type UsuarioSistema } from '@shared/data/adminMockData';

export function AdminUsuariosRolesView() {
  const toast = useToast();
  const [usuarios, setUsuarios] = useState(MOCK_USUARIOS_SISTEMA);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ nombre: '', email: '', rol: 'admin' as RolSistema });

  const toggleActivo = (usuario: UsuarioSistema) => {
    setUsuarios((prev) => prev.map((u) => (u.id === usuario.id ? { ...u, activo: !u.activo } : u)));
    toast.success(`Usuario ${usuario.activo ? 'desactivado' : 'activado'}.`);
  };

  const cambiarRol = (id: string, rol: RolSistema) => {
    setUsuarios((prev) => prev.map((u) => (u.id === id ? { ...u, rol } : u)));
    toast.success('Rol actualizado.');
  };

  const crearAdmin = () => {
    if (!form.nombre || !form.email) {
      toast.error('Completa nombre y correo.');
      return;
    }
    const nuevo: UsuarioSistema = {
      id: `usr-${Date.now()}`,
      nombre: form.nombre,
      email: form.email,
      rol: form.rol,
      activo: true,
      ultimoAcceso: new Date().toISOString(),
    };
    setUsuarios((prev) => [...prev, nuevo]);
    setModal(false);
    setForm({ nombre: '', email: '', rol: 'admin' });
    toast.success('Usuario creado correctamente.');
  };

  const columns: TableColumn<UsuarioSistema>[] = [
    { key: 'nombre', header: 'Nombre' },
    { key: 'email', header: 'Correo' },
    {
      key: 'rol',
      header: 'Rol',
      render: (r) => (
        <Select
          value={r.rol}
          onChange={(e) => cambiarRol(r.id, e.target.value as RolSistema)}
          className="min-w-[7rem] py-1 text-sm"
          aria-label={`Rol de ${r.nombre}`}
        >
          <option value="admin">Admin</option>
          <option value="operador">Operador</option>
          <option value="cliente">Cliente</option>
        </Select>
      ),
    },
    {
      key: 'activo',
      header: 'Estado',
      render: (r) => <StatusBadge status={r.activo ? 'activo' : 'inactivo'} label={r.activo ? 'Activo' : 'Inactivo'} />,
    },
    { key: 'ultimoAcceso', header: 'Último acceso', render: (r) => formatDate(r.ultimoAcceso) },
    {
      key: 'acciones',
      header: 'Acciones',
      render: (r) => (
        <TableActions>
          <TableActionButton type="button" onClick={() => toggleActivo(r)}>
            {r.activo ? 'Desactivar' : 'Activar'}
          </TableActionButton>
        </TableActions>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-end">
        <ActionButton type="button" onClick={() => setModal(true)}>
          Crear usuario administrador
        </ActionButton>
      </div>

      <SectionCard title="Usuarios del sistema">
        <Table columns={columns} data={usuarios} />
      </SectionCard>

      <Modal isOpen={modal} onClose={() => setModal(false)} title="Crear usuario">
        <div className="space-y-4">
          <FormField label="Nombre" htmlFor="usr-nombre" required>
            <Input id="usr-nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
          </FormField>
          <FormField label="Correo" htmlFor="usr-email" required>
            <Input id="usr-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </FormField>
          <FormField label="Rol" htmlFor="usr-rol" required>
            <Select id="usr-rol" value={form.rol} onChange={(e) => setForm({ ...form, rol: e.target.value as RolSistema })}>
              <option value="admin">Administrador</option>
              <option value="operador">Operador</option>
              <option value="cliente">Cliente</option>
            </Select>
          </FormField>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setModal(false)}>Cancelar</Button>
            <ActionButton type="button" onClick={crearAdmin}>Crear</ActionButton>
          </div>
        </div>
      </Modal>
    </div>
  );
}
