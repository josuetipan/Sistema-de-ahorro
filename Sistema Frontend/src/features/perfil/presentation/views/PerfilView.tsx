// Perfil — datos personales
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormField } from '@shared/ui/molecules/FormField';
import { SectionCard } from '@shared/ui/molecules/SectionCard';
import { Input } from '@shared/ui/atoms/Input';
import { ActionButton } from '@shared/ui/atoms/ActionButton';
import { useAuth } from '@shared/hooks/useAuth';
import { useToast } from '@shared/hooks/useToast';
import { perfilSchema, type PerfilFormData } from '@shared/lib/validators';
import { PerfilAvatar } from '@features/perfil/presentation/components/PerfilAvatar';

export function PerfilView() {
  const { user, setUser } = useAuth();
  const toast = useToast();

  const perfilForm = useForm<PerfilFormData>({
    resolver: zodResolver(perfilSchema),
    defaultValues: {
      email: user?.email ?? '',
      telefono: user?.perfil?.telefono ?? '5512345678',
      direccion: user?.perfil?.direccion ?? 'Calle Principal 123, CDMX',
    },
  });

  const guardarPerfil = async (data: PerfilFormData) => {
    await new Promise((r) => setTimeout(r, 400));
    if (user) {
      setUser({
        ...user,
        email: data.email,
        perfil: { ...user.perfil, telefono: data.telefono, direccion: data.direccion },
      });
    }
    toast.success('Datos personales actualizados.');
  };

  const actualizarFoto = (fotoPerfil: string) => {
    if (!user) return;
    setUser({
      ...user,
      perfil: { ...user.perfil, fotoPerfil },
    });
    toast.success('Foto de perfil actualizada.');
  };

  return (
    <div className="flex w-full flex-col gap-4 lg:gap-6">
      <div className="grid gap-4 lg:grid-cols-3 lg:items-stretch">
        <div className="section-card-shell h-full min-h-[16rem] overflow-hidden p-0 lg:col-span-1">
          <PerfilAvatar
            nombre={user?.nombre ?? 'Usuario'}
            fotoPerfil={user?.perfil?.fotoPerfil}
            layout="card"
            editable
            onFotoChange={actualizarFoto}
            className="h-full"
          />
        </div>

        <SectionCard title="Datos personales" className="lg:col-span-2">
          <form onSubmit={perfilForm.handleSubmit(guardarPerfil)} noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Nombre" htmlFor="nombre" className="sm:col-span-2">
                <Input id="nombre" value={user?.nombre ?? ''} readOnly disabled />
              </FormField>

              <FormField
                label="Correo"
                htmlFor="email"
                error={perfilForm.formState.errors.email?.message}
                required
              >
                <Input
                  type="email"
                  spellCheck={false}
                  hasError={!!perfilForm.formState.errors.email}
                  {...perfilForm.register('email')}
                />
              </FormField>

              <FormField
                label="Teléfono"
                htmlFor="telefono"
                error={perfilForm.formState.errors.telefono?.message}
                required
              >
                <Input
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  hasError={!!perfilForm.formState.errors.telefono}
                  {...perfilForm.register('telefono')}
                />
              </FormField>

              <FormField
                label="Dirección"
                htmlFor="direccion"
                error={perfilForm.formState.errors.direccion?.message}
                required
                className="sm:col-span-2"
              >
                <Input
                  hasError={!!perfilForm.formState.errors.direccion}
                  {...perfilForm.register('direccion')}
                />
              </FormField>
            </div>

            <div className="mt-4 flex justify-end border-t border-slate-100 pt-4">
              <ActionButton
                type="submit"
                isLoading={perfilForm.formState.isSubmitting}
                className="w-full sm:w-auto sm:min-w-[10rem]"
              >
                Guardar cambios
              </ActionButton>
            </div>
          </form>
        </SectionCard>
      </div>
    </div>
  );
}
