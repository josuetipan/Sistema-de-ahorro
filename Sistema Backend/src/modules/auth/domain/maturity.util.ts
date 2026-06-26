/**
 * Fecha de vencimiento al final del día UTC del calendario indicado.
 * Evita que `YYYY-MM-DD` (medianoche UTC) deje la cuenta “vencida” enseguida.
 */
export function maturityAtEndOfUtcCalendarDay(d: Date): Date {
  const y = d.getUTCFullYear();
  const m = d.getUTCMonth();
  const day = d.getUTCDate();
  return new Date(Date.UTC(y, m, day, 23, 59, 59, 999));
}

/** true si ya pasó el último instante del día UTC de vencimiento. */
export function isMaturityExpired(maturityAt: Date): boolean {
  const y = maturityAt.getUTCFullYear();
  const m = maturityAt.getUTCMonth();
  const d = maturityAt.getUTCDate();
  const endOfDayUtc = Date.UTC(y, m, d, 23, 59, 59, 999);
  return Date.now() > endOfDayUtc;
}
