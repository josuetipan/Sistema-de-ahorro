"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJwtAccessSecret = getJwtAccessSecret;
const DEFAULT_ACCESS_SECRET = 'dev-access-secret-change-me';
function getJwtAccessSecret() {
    const v = process.env.JWT_SECRET?.trim();
    return v && v.length > 0 ? v : DEFAULT_ACCESS_SECRET;
}
//# sourceMappingURL=jwt-access-secret.js.map