const CARACTERES_CLAVE = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#';

export function generarNumeroCuentaUnico(existentes: Set<string>): string {
  let numero: string;
  do {
    const secuencia = String(Math.floor(Math.random() * 900000) + 100000);
    numero = `AH-${secuencia}`;
  } while (existentes.has(numero));
  return numero;
}

export function generarUsuarioUnico(existentes: Set<string>): string {
  let usuario: string;
  do {
    const sufijo = Math.random().toString(36).substring(2, 8);
    usuario = `usr_${sufijo}`;
  } while (existentes.has(usuario));
  return usuario;
}

export function generarClaveUnica(existentes: Set<string>): string {
  let clave: string;
  do {
    clave = Array.from({ length: 12 }, () =>
      CARACTERES_CLAVE[Math.floor(Math.random() * CARACTERES_CLAVE.length)],
    ).join('');
  } while (existentes.has(clave));
  return clave;
}

export function construirCuerpoEmailEnmascarado(numeroCuenta: string): string {
  return `Usuario: **** | Clave: **** | Número de cuenta: ${numeroCuenta}`;
}

export function normalizarBusqueda(termino: string): string {
  return termino.trim();
}
