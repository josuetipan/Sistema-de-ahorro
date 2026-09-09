import { useCallback, useEffect, useState } from 'react';
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
import {
  createAdminUser,
  getAdminUsers,
  setAdminUserStatus,
  updateAdminUser,
  type AdminUser,
} from '../../infrastructure/api/admin-users.api';

type RoleCode = 'ADMIN' | 'CUSTOMER' | 'ACCOUNTANT';

const EMPTY_FORM = {
  fullName: '',
  identification: '',
  email: '',
  phoneNumber: '',
  password: '',
  roleCode: 'CUSTOMER' as RoleCode,
};

export function AdminUsuariosRolesView() {
  const toast = useToast();
  const [usuarios, setUsuarios] = useState<AdminUser[]>([]);
  const [modal, setModal] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [editando, setEditando] = useState<AdminUser | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      setUsuarios(await getAdminUsers());
    } catch {
      toast.error('No se pudieron cargar los usuarios.');
    } finally {
      setCargando(false);
    }
  }, [toast]);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  const crearUsuario = async () => {
    if (!form.fullName || !form.identification || !form.email || !form.phoneNumber || !form.password) {
      toast.error('Completa todos los campos obligatorios.');
      return;
    }
    try {
      await createAdminUser(form);
      setModal(false);
      setForm(EMPTY_FORM);
      toast.success('Usuario creado correctamente.');
      await cargar();
    } catch {
      toast.error('No se pudo crear el usuario.');
    }
  };

  const toggleActivo = async (usuario: AdminUser) => {
    try {
      await setAdminUserStatus(usuario.id, !usuario.isActive);
      toast.success(usuario.isActive ? 'Usuario desactivado.' : 'Usuario activado.');
      await cargar();
    } catch {
      toast.error('No se pudo actualizar el estado.');
    }
  };

  const guardarEdicion = async () => {
    if (!editando || !form.fullName || !form.email) {
      toast.error('Completa nombre y correo.');
      return;
    }
    try {
      await updateAdminUser(editando.id, {
        fullName: form.fullName,
        email: form.email,
        identification: form.identification,
        phoneNumber: form.phoneNumber,
        roleCode: form.roleCode,
      });
      setEditando(null);
      setForm(EMPTY_FORM);
      toast.success('Usuario actualizado correctamente.');
      await cargar();
    } catch {
      toast.error('No se pudo actualizar el usuario.');
    }
  };

  const columns: TableColumn<AdminUser>[] = [
    { key: 'fullName', header: 'Nombre' },
    { key: 'email', header: 'Correo' },
    { key: 'roleName', header: 'Rol' },
    {
      key: 'isActive',
      header: 'Estado',
      render: (row) => (
        <StatusBadge
          status={row.isActive ? 'activo' : 'inactivo'}
          label={row.isActive ? 'Activo' : 'Inactivo'}
        />
      ),
    },
    {
      key: 'acciones',
      header: 'Acciones',
      render: (row) => (
        <TableActions>
          <TableActionButton
            type="button"
            onClick={() => {
              setEditando(row);
              setForm({
                fullName: row.fullName,
                identification: row.identification ?? '',
                email: row.email ?? '',
                phoneNumber: row.phoneNumber ?? '',
                password: '',
                roleCode: row.roleCode as RoleCode,
              });
            }}
          >
            Editar
          </TableActionButton>
          <TableActionButton type="button" onClick={() => void toggleActivo(row)}>
            {row.isActive ? 'Desactivar' : 'Activar'}
          </TableActionButton>
        </TableActions>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-end">
        <ActionButton type="button" onClick={() => setModal(true)}>
          Crear usuario
        </ActionButton>
      </div>
      <SectionCard title="Usuarios del sistema">
        {cargando ? (
          <p className="p-4 text-sm text-slate-500">Cargando usuarios...</p>
        ) : (
          <Table columns={columns} data={usuarios} />
        )}
      </SectionCard>
      <Modal
        isOpen={modal || Boolean(editando)}
        onClose={() => {
          setModal(false);
          setEditando(null);
          setForm(EMPTY_FORM);
        }}
        title={editando ? 'Editar usuario' : 'Crear usuario'}
      >
        <div className="space-y-4">
          <FormField label="Nombre completo" htmlFor="usr-nombre" required>
            <Input id="usr-nombre" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
          </FormField>
          <FormField label="Identificación" htmlFor="usr-identificacion" required>
            <Input id="usr-identificacion" value={form.identification} onChange={(e) => setForm({ ...form, identification: e.target.value })} />
          </FormField>
          <FormField label="Correo" htmlFor="usr-email" required>
            <Input id="usr-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </FormField>
          <FormField label="Teléfono" htmlFor="usr-telefono" required>
            <Input id="usr-telefono" value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} />
          </FormField>
          {!editando && <FormField label="Contraseña inicial" htmlFor="usr-password" required>
            <Input id="usr-password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </FormField>}
          <FormField label="Rol" htmlFor="usr-rol" required>
            <Select id="usr-rol" value={form.roleCode} onChange={(e) => setForm({ ...form, roleCode: e.target.value as RoleCode })}>
              <option value="ADMIN">Administrador</option>
              <option value="CUSTOMER">Cliente</option>
              <option value="ACCOUNTANT">Contador</option>
            </Select>
          </FormField>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setModal(false)}>Cancelar</Button>
            <ActionButton type="button" onClick={() => void (editando ? guardarEdicion() : crearUsuario())}>
              {editando ? 'Guardar' : 'Crear'}
            </ActionButton>
          </div>
        </div>
      </Modal>
    </div>
  );
}
