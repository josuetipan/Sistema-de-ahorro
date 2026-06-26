import { useMemo, useState } from 'react';
import { SectionCard } from '@shared/ui/molecules/SectionCard';
import { CreateAccountForm } from '../components/CreateAccountForm';
import { useCuentasAhorroAdmin } from '../../application/hooks/useCuentasAhorroAdmin';
import type { SocioResumen } from '../../domain/cuenta-ahorro.entity';

export function AdminCrearCuentaPanel() {
  const { buscarSocios, crearCuenta, cuentas, recargar } = useCuentasAhorroAdmin();
  const [socioActivo, setSocioActivo] = useState<SocioResumen | null>(null);

  const cuentasFiltradas = useMemo(
    () => (socioActivo ? cuentas.filter((c) => c.socioId === socioActivo.id) : []),
    [cuentas, socioActivo],
  );

  return (
    <SectionCard
      title="Crear cuenta de ahorro"
      subtitle="Las credenciales se generan automáticamente y se simulan por correo — nunca se muestran en pantalla."
    >
      <CreateAccountForm
        buscarSocios={buscarSocios}
        crearCuenta={crearCuenta}
        cuentasSocio={cuentasFiltradas}
        onSocioSeleccionado={setSocioActivo}
        onCuentaCreada={() => void recargar()}
      />
    </SectionCard>
  );
}
