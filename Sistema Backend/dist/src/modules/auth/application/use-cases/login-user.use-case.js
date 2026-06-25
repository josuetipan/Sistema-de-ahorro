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
exports.LoginUserUseCase = void 0;
const bcrypt = __importStar(require("bcrypt"));
const invalid_credentials_error_1 = require("../../domain/invalid-credentials.error");
const user_inactive_error_1 = require("../../domain/user-inactive.error");
const maturity_expired_error_1 = require("../../domain/maturity-expired.error");
const maturity_util_1 = require("../../domain/maturity.util");
const build_auth_session_1 = require("./build-auth-session");
class LoginUserUseCase {
    users;
    refreshRepo;
    tokens;
    constructor(users, refreshRepo, tokens) {
        this.users = users;
        this.refreshRepo = refreshRepo;
        this.tokens = tokens;
    }
    async execute(input) {
        const identifier = input.usuario.trim();
        let user = await this.users.findByUsuario(identifier);
        if (!user) {
            user = await this.users.findByEmail(identifier);
        }
        if (!user) {
            throw new invalid_credentials_error_1.InvalidCredentialsError();
        }
        if (!user.isActive) {
            throw new user_inactive_error_1.UserInactiveError();
        }
        if ((0, maturity_util_1.isMaturityExpired)(user.maturityAt)) {
            throw new maturity_expired_error_1.MaturityExpiredError();
        }
        const ok = await bcrypt.compare(input.password, user.passwordHash);
        if (!ok) {
            throw new invalid_credentials_error_1.InvalidCredentialsError();
        }
        await this.refreshRepo.revokeAllForUser(user.id);
        await this.users.touchLastLogin(user.id);
        return (0, build_auth_session_1.buildAuthSession)(user, this.tokens, this.refreshRepo);
    }
}
exports.LoginUserUseCase = LoginUserUseCase;
//# sourceMappingURL=login-user.use-case.js.map