// Utilidades de formateo — fechas completas sin truncar en UI
const currencyFormatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
});

const dateNumericFormatter = new Intl.DateTimeFormat('es-MX', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

const dateLongFormatter = new Intl.DateTimeFormat('es-MX', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const numberFormatter = new Intl.NumberFormat('es-MX');

function parseDate(date: string | Date): Date {
  return typeof date === 'string' ? new Date(date) : date;
}

export function formatCurrency(amount: number, currency = 'MXN'): string {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency }).format(amount);
}

/** Fecha corta numérica: 15/06/2026 — cabe en tablas sin cortar palabras */
export function formatDate(date: string | Date): string {
  const value = parseDate(date);
  if (Number.isNaN(value.getTime())) return 'Sin fecha';
  return dateNumericFormatter.format(value);
}

/** Fecha larga para detalle: viernes, 15 de junio de 2026 */
export function formatDateLong(date: string | Date): string {
  const value = parseDate(date);
  if (Number.isNaN(value.getTime())) return 'Sin fecha';
  return dateLongFormatter.format(value);
}

export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

/** Tamaño de archivo legible: 1.2 MB, 450 KB */
export function formatFileSize(bytes?: number): string {
  if (bytes == null || Number.isNaN(bytes)) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export { currencyFormatter, numberFormatter };
