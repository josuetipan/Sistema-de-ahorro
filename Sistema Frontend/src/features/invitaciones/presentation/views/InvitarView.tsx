import { useState } from 'react';
import { ActionButton } from '@shared/ui/atoms/ActionButton';
import { Input } from '@shared/ui/atoms/Input';
import { SectionCard } from '@shared/ui/molecules/SectionCard';
import { NavIcon } from '@shared/ui/atoms/NavIcon';
import { useToast } from '@shared/hooks/useToast';
import { useMiInvitacion } from '@features/cuentas/application/hooks/useMiInvitacion';

export function InvitarView() {
  const toast = useToast();
  const { invitacion, cargando, error } = useMiInvitacion();
  const [copiado, setCopiado] = useState(false);

  const codigo = invitacion?.codigo ?? '';
  const enlace = codigo ? `${window.location.origin}/registro?ref=${codigo}` : '';

  const copiar = async (texto: string, mensaje: string) => {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
      toast.success(mensaje);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      toast.error('No se pudo copiar. Intenta manualmente.');
    }
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div className="text-center">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
          <NavIcon name="users" size={28} />
        </span>
        <h2 className="mt-4 text-xl font-semibold text-slate-900">Invita a alguien a ahorrar</h2>
        <p className="mt-2 text-sm text-slate-500">
          Comparte tu código de invitación para que más personas se unan a la cooperativa de ahorro.
        </p>
      </div>

      <SectionCard title="Tu código de invitación">
        <div className="flex flex-col items-center gap-4 py-4">
          {cargando ? (
            <p className="text-sm text-slate-400">Cargando tu código…</p>
          ) : error || !codigo ? (
            <p className="text-sm text-amber-600">{error ?? 'No tienes un código de invitación disponible.'}</p>
          ) : (
            <>
              <p
                className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-4 font-mono text-2xl font-bold tracking-widest text-white shadow-lg shadow-emerald-500/25"
                translate="no"
              >
                {codigo}
              </p>
              <ActionButton type="button" onClick={() => copiar(codigo, 'Código copiado al portapapeles.')}>
                <NavIcon name="transfer" size={16} />
                {copiado ? '¡Copiado!' : 'Copiar código'}
              </ActionButton>
            </>
          )}
        </div>
      </SectionCard>

      {codigo && (
        <SectionCard title="Enlace de invitación">
          <p className="mb-3 text-sm text-slate-500">
            Comparte este enlace para que la persona se registre directamente con tu referido.
          </p>
          <div className="flex gap-2">
            <Input value={enlace} readOnly className="font-mono text-xs" translate="no" />
            <ActionButton
              type="button"
              variant="outline"
              onClick={() => copiar(enlace, 'Enlace copiado al portapapeles.')}
            >
              Copiar
            </ActionButton>
          </div>
        </SectionCard>
      )}

      {invitacion && (
        <p className="text-center text-xs text-slate-400">
          Código asociado a <strong className="text-slate-600">{invitacion.titular}</strong>
          {invitacion.socioCodigo && (
            <>
              {' · Socio '}
              <strong className="text-slate-600" translate="no">
                {invitacion.socioCodigo}
              </strong>
            </>
          )}
        </p>
      )}
    </div>
  );
}
