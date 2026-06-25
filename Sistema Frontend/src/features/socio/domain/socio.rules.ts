import type { Socio, ValidacionCodigoReferencia } from './socio.entity';

const CODIGO_REFERENCIA_REGEX = /^SOC-[A-Z0-9]{6}$/;

export function generarCodigoReferencia(): string {
  return `SOC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}

export function generarCodigoReferenciaUnico(socios: Socio[]): string {
  const existentes = new Set(socios.map((s) => s.codigoReferencia));
  let codigo = generarCodigoReferencia();
  while (existentes.has(codigo)) {
    codigo = generarCodigoReferencia();
  }
  return codigo;
}

export function generarNumeroCuenta(): string {
  const socioSeq = String(Math.floor(Math.random() * 999) + 1).padStart(3, '0');
  const cuentaSeq = String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0');
  return `${socioSeq}-${cuentaSeq}`;
}

export function normalizarCodigoReferencia(codigo: string): string {
  return codigo.trim().toUpperCase();
}

export function obtenerCodigosReferenciaValidos(socios: Socio[]): string[] {
  return socios.filter((s) => s.estado === 'activo').map((s) => s.codigoReferencia);
}

export function validarCodigoReferencia(
  codigo: string,
  socios: Socio[],
  opciones?: { excluirSocioId?: string; obligatorio?: boolean },
): ValidacionCodigoReferencia {
  const normalizado = normalizarCodigoReferencia(codigo);
  const obligatorio = opciones?.obligatorio ?? false;

  if (!normalizado) {
    if (obligatorio) {
      return { valido: false, error: 'El código de referencia es obligatorio.' };
    }
    return { valido: true };
  }

  if (!CODIGO_REFERENCIA_REGEX.test(normalizado)) {
    return { valido: false, error: 'Formato inválido. Use el patrón SOC-XXXXXX.' };
  }

  const socioReferidor = socios.find(
    (s) => s.codigoReferencia === normalizado && s.id !== opciones?.excluirSocioId,
  );

  if (!socioReferidor) {
    return { valido: false, error: 'El código de referencia no corresponde a ningún socio activo.' };
  }

  if (socioReferidor.estado !== 'activo') {
    return { valido: false, error: 'El socio referidor no está activo.' };
  }

  return { valido: true, socioReferidor };
}

export function calcularSaldoTotal(socio: Socio): number {
  return socio.cuentas.reduce((sum, cuenta) => sum + cuenta.saldo, 0);
}

export function obtenerNombreReferidor(socio: Socio, socios: Socio[]): string | undefined {
  if (socio.referidoPorId) {
    return socios.find((s) => s.id === socio.referidoPorId)?.nombres;
  }
  if (socio.referidoPor) {
    return socios.find((s) => s.codigoReferencia === socio.referidoPor)?.nombres;
  }
  return undefined;
}

export function obtenerCodigoReferidor(socio: Socio): string | undefined {
  return socio.referidoPor ?? undefined;
}
