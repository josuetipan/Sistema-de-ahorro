import { useEffect, useState } from 'react';
import { ActionButton } from '@shared/ui/atoms/ActionButton';
import { Input } from '@shared/ui/atoms/Input';
import { FormField } from '@shared/ui/molecules/FormField';
import { FilterChipGroup } from '@shared/ui/molecules/FilterChipGroup';
import type {
  CrearCuentaAhorroInput,
  EmailSimulado,
  ModoCreacionCuenta,
  ResultadoCreacionCuenta,
  SocioResumen,
} from '../../domain/cuenta-ahorro.entity';
import { SocioSearch } from './SocioSearch';
import { SocioSelector } from './SocioSelector';
import { AccountList } from './AccountList';
import { EmailSimulationModal } from './EmailSimulationModal';

interface CreateAccountFormProps {
  buscarSocios: (termino: string) => Promise<SocioResumen[]>;
  crearCuenta: (input: CrearCuentaAhorroInput) => Promise<ResultadoCreacionCuenta>;
  cuentasSocio: import('../../domain/cuenta-ahorro.entity').CuentaAhorroPublica[];
  onCuentaCreada?: () => void;
  onSocioSeleccionado?: (socio: SocioResumen | null) => void;
}

const FORM_VACIO = {
  nombres: '',
  cedula: '',
  correo: '',
  telefono: '',
};

export function CreateAccountForm({
  buscarSocios,
  crearCuenta,
  cuentasSocio,
  onCuentaCreada,
  onSocioSeleccionado,
}: CreateAccountFormProps) {
  const [modo, setModo] = useState<ModoCreacionCuenta>('con_referencia');
  const [resultados, setResultados] = useState<SocioResumen[]>([]);
  const [socioSeleccionado, setSocioSeleccionado] = useState<SocioResumen | null>(null);
  const [form, setForm] = useState(FORM_VACIO);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailModal, setEmailModal] = useState<EmailSimulado | null>(null);
  const [ultimoNumeroCuenta, setUltimoNumeroCuenta] = useState<string>();

  useEffect(() => {
    setResultados([]);
    setSocioSeleccionado(null);
    onSocioSeleccionado?.(null);
    setForm(FORM_VACIO);
    setError(null);
  }, [modo, onSocioSeleccionado]);

  const seleccionarSocio = (socio: SocioResumen) => {
    setSocioSeleccionado(socio);
    onSocioSeleccionado?.(socio);
    setForm({
      nombres: socio.nombres,
      cedula: socio.cedula,
      correo: socio.email,
      telefono: socio.telefono,
    });
    setError(null);
  };

  const actualizar = (campo: keyof typeof form, valor: string) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
    setError(null);
  };

  const validar = (): boolean => {
    if (!form.nombres.trim() || !form.cedula.trim() || !form.correo.trim() || !form.telefono.trim()) {
      setError('Completa todos los campos obligatorios.');
      return false;
    }
    if (modo === 'con_referencia' && !socioSeleccionado) {
      setError('Busca y selecciona un socio antes de crear la cuenta.');
      return false;
    }
    return true;
  };

  const enviar = async () => {
    if (!validar()) return;

    setGuardando(true);
    setError(null);
    try {
      const input: CrearCuentaAhorroInput = {
        modo,
        socioId: socioSeleccionado?.id,
        nombres: form.nombres,
        cedula: form.cedula,
        correo: form.correo,
        telefono: form.telefono,
        codigoReferenciaBusqueda: socioSeleccionado?.codigoReferencia ?? form.cedula,
      };

      const resultado = await crearCuenta(input);
      const { emailSimulado, cuenta } = resultado;
      onSocioSeleccionado?.({
        id: cuenta.socioId,
        nombres: form.nombres,
        cedula: form.cedula,
        email: form.correo,
        telefono: form.telefono,
        codigoReferencia: cuenta.codigoReferencia ?? '',
      });
      const numeroMatch = emailSimulado.body.match(/Número de cuenta: (.+)$/);
      setUltimoNumeroCuenta(numeroMatch?.[1]);
      setEmailModal(emailSimulado);
      onCuentaCreada?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo crear la cuenta.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="space-y-5">
      <FilterChipGroup
        ariaLabel="Modo de creación"
        value={modo}
        onChange={setModo}
        options={[
          { value: 'con_referencia', label: 'Con referencia' },
          { value: 'sin_referencia', label: 'Sin referencia' },
        ]}
      />

      {modo === 'con_referencia' && (
        <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50/50 p-4">
          <p className="text-sm font-medium text-slate-700">Buscar socio existente</p>
          <SocioSearch
            onBuscar={buscarSocios}
            onResultados={setResultados}
            disabled={guardando}
          />
          <SocioSelector
            resultados={resultados}
            seleccionadoId={socioSeleccionado?.id}
            onSeleccionar={seleccionarSocio}
          />
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Nombres" htmlFor="cta-nombres" required>
          <Input
            id="cta-nombres"
            value={form.nombres}
            onChange={(e) => actualizar('nombres', e.target.value)}
            disabled={modo === 'con_referencia' && !!socioSeleccionado}
          />
        </FormField>
        <FormField label="Cédula" htmlFor="cta-cedula" required>
          <Input
            id="cta-cedula"
            value={form.cedula}
            onChange={(e) => actualizar('cedula', e.target.value)}
            disabled={modo === 'con_referencia' && !!socioSeleccionado}
          />
        </FormField>
        <FormField label="Correo (editable por cuenta)" htmlFor="cta-correo" required>
          <Input
            id="cta-correo"
            type="email"
            value={form.correo}
            onChange={(e) => actualizar('correo', e.target.value)}
          />
        </FormField>
        <FormField label="Teléfono" htmlFor="cta-telefono" required>
          <Input
            id="cta-telefono"
            value={form.telefono}
            onChange={(e) => actualizar('telefono', e.target.value)}
            disabled={modo === 'con_referencia' && !!socioSeleccionado}
          />
        </FormField>
      </div>

      {modo === 'con_referencia' && socioSeleccionado && (
        <p className="text-xs text-slate-600">
          Código de referencia del socio:{' '}
          <span className="font-mono font-semibold">{socioSeleccionado.codigoReferencia}</span>
          {socioSeleccionado.referidoPor && (
            <span className="ml-2 text-slate-500">· Referido por: {socioSeleccionado.referidoPor}</span>
          )}
        </p>
      )}

      {modo === 'sin_referencia' && (
        <p className="rounded-lg border border-sky-100 bg-sky-50 px-3 py-2 text-xs text-sky-800">
          La cuenta se creará sin código de referencia asociado. Si el socio no existe, se registrará
          automáticamente.
        </p>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <ActionButton type="button" onClick={() => void enviar()} disabled={guardando}>
        {guardando ? 'Creando cuenta…' : 'Crear cuenta de ahorro'}
      </ActionButton>

      {(socioSeleccionado || cuentasSocio.length > 0) && (
        <AccountList
          cuentas={cuentasSocio}
          titulo={
            socioSeleccionado
              ? `Cuentas actuales de ${socioSeleccionado.nombres}`
              : 'Cuentas del socio'
          }
        />
      )}

      <EmailSimulationModal
        email={emailModal}
        numeroCuenta={ultimoNumeroCuenta}
        onClose={() => setEmailModal(null)}
      />
    </div>
  );
}
