export interface UploadedFileLike {
    originalname: string;
    mimetype: string;
    size: number;
    buffer: Buffer;
}
export declare const IMAGE_MIME_TYPES: string[];
export declare const COMPROBANTE_MIME_TYPES: string[];
export declare const MAX_UPLOAD_BYTES: number;
export declare function assertAllowedMime(file: UploadedFileLike, allowed: string[]): void;
export declare function toBase64DataUri(file: UploadedFileLike): string;
