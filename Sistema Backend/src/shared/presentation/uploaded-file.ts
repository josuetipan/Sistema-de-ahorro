import { BadRequestException } from '@nestjs/common';

/** Forma mínima del archivo que entrega multer (sin depender de @types/multer). */
export interface UploadedFileLike {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

export const IMAGE_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/gif',
];

export const COMPROBANTE_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'application/pdf',
];

/** Límite por defecto para subidas guardadas como base64 (5 MB). */
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

/** Valida que el MIME del archivo esté dentro de los permitidos. */
export function assertAllowedMime(
  file: UploadedFileLike,
  allowed: string[],
): void {
  if (!allowed.includes(file.mimetype)) {
    throw new BadRequestException(
      `Tipo de archivo no permitido (${file.mimetype}). Permitidos: ${allowed.join(', ')}`,
    );
  }
}

/** Convierte el archivo a una cadena base64 con prefijo data URI para guardarla en BD. */
export function toBase64DataUri(file: UploadedFileLike): string {
  return `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
}
