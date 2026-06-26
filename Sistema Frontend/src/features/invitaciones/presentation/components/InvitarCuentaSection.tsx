import { useState } from 'react';
import { ActionButton } from '@shared/ui/atoms/ActionButton';
import { SectionCard } from '@shared/ui/molecules/SectionCard';
import { NavIcon } from '@shared/ui/atoms/NavIcon';
import { useToast } from '@shared/hooks/useToast';
import { useAuth } from '@shared/hooks/useAuth';
import { MOCK_CODIGO_INVITACION } from '@shared/data/ahorroMockData';

function buildMensajeInvitacion(codigo: string, nombre?: string) {
  const enlace = `${window.location.origin}/registro?ref=${codigo}`;
  const firma = nombre ? `\n\n— ${nombre}` : '';

  return `¡Hola! 👋

Te invito a unirte a Finnova, nuestra cooperativa de ahorro programado. Es una forma sencilla de ahorrar cada mes y cumplir tus metas.

🎟️ Tu código de invitación: ${codigo}

Regístrate aquí: ${enlace}

¡Te esperamos!${firma}`;
}

export function InvitarCuentaSection({ className = '' }: { className?: string }) {
  const toast = useToast();
  const { user } = useAuth();
  const [copiado, setCopiado] = useState(false);

  const codigo = MOCK_CODIGO_INVITACION;

  const copiarInvitacion = async () => {
    const mensaje = buildMensajeInvitacion(codigo, user?.nombre);

    try {
      await navigator.clipboard.writeText(mensaje);
      setCopiado(true);
      toast.success(
        '¡Listo! Copiamos tu mensaje de invitación con el código. Pégalo en WhatsApp o donde quieras compartirlo.',
      );
      setTimeout(() => setCopiado(false), 2500);
    } catch {
      toast.error('No se pudo copiar. Intenta manualmente.');
    }
  };

  return (
    <SectionCard
      title="Invitar a alguien"
      subtitle="Comparte tu código para que más personas se unan a la cooperativa de ahorro."
      className={className}
    >
      <div className="flex flex-col gap-4">
        <p
          className="rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-4 text-center font-mono text-lg font-bold tracking-widest text-white"
          translate="no"
        >
          {codigo}
        </p>

        <p className="text-center text-sm text-slate-500">
          Al copiar, se incluye un mensaje de invitación listo para enviar junto con tu código.
        </p>

        <ActionButton type="button" fullWidth onClick={copiarInvitacion}>
          <NavIcon name="transfer" size={16} />
          {copiado ? '¡Mensaje copiado!' : 'Copiar código'}
        </ActionButton>

        {user && (
          <p className="text-center text-xs text-slate-400">
            Código asociado a <strong className="text-slate-600">{user.nombre}</strong>
          </p>
        )}
      </div>
    </SectionCard>
  );
}
