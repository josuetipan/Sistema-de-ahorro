"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAX_UPLOAD_BYTES = exports.COMPROBANTE_MIME_TYPES = exports.IMAGE_MIME_TYPES = void 0;
exports.assertAllowedMime = assertAllowedMime;
exports.toBase64DataUri = toBase64DataUri;
const common_1 = require("@nestjs/common");
exports.IMAGE_MIME_TYPES = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp',
    'image/gif',
];
exports.COMPROBANTE_MIME_TYPES = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'application/pdf',
];
exports.MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
function assertAllowedMime(file, allowed) {
    if (!allowed.includes(file.mimetype)) {
        throw new common_1.BadRequestException(`Tipo de archivo no permitido (${file.mimetype}). Permitidos: ${allowed.join(', ')}`);
    }
}
function toBase64DataUri(file) {
    return `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
}
//# sourceMappingURL=uploaded-file.js.map