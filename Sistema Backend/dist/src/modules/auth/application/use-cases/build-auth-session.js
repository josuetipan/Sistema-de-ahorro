"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildAuthSession = buildAuthSession;
const bcrypt = __importStar(require("bcrypt"));
const SALT_ROUNDS = 10;
function refreshExpiresAt() {
    const days = Number(process.env.JWT_REFRESH_EXPIRES_DAYS ?? '7');
    const d = new Date();
    d.setDate(d.getDate() + (Number.isFinite(days) && days > 0 ? days : 7));
    return d;
}
async function buildAuthSession(user, tokens, refreshRepo) {
    const accessToken = await tokens.createAccessToken(user.id, user.roles);
    const refreshToken = await tokens.createRefreshToken(user.id);
    const tokenHash = await bcrypt.hash(refreshToken, SALT_ROUNDS);
    await refreshRepo.create(user.id, tokenHash, refreshExpiresAt());
    return {
        accessToken,
        refreshToken,
        expiresIn: tokens.getAccessExpiresInSeconds(),
        user: {
            id: user.id,
            usuario: user.usuario,
            identification: user.identification,
            email: user.email,
            fullName: user.fullName,
            cityId: user.cityId,
            cityName: user.cityName,
            roles: [...user.roles],
            isActive: user.isActive,
            pending_password_reset: user.pendingPasswordReset,
            maturityAt: user.maturityAt.toISOString(),
        },
    };
}
//# sourceMappingURL=build-auth-session.js.map