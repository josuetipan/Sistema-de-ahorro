const DEFAULT_ACCESS_SECRET = 'dev-access-secret-change-me';

/**
 * Mismo valor debe usarse al firmar (auth) y al verificar (dashboard, licenses).
 * Trata cadena vacía como “no definido” para no romper la firma entre servicios.
 */
export function getJwtAccessSecret(): string {
  const v = process.env.JWT_SECRET?.trim();
  return v && v.length > 0 ? v : DEFAULT_ACCESS_SECRET;
}
