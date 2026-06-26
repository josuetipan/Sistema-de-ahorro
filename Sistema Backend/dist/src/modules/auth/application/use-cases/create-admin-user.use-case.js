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
exports.CreateAdminUserUseCase = void 0;
const node_crypto_1 = require("node:crypto");
const bcrypt = __importStar(require("bcrypt"));
const email_already_taken_error_1 = require("../../domain/email-already-taken.error");
const role_code_not_found_error_1 = require("../../domain/role-code-not-found.error");
const user_role_1 = require("../../domain/user-role");
const ADMIN_CITY_NAME = 'Sistema';
const ADMIN_MATURITY_FAR = new Date('2099-12-31T23:59:59.999Z');
const SALT_ROUNDS = 10;
class CreateAdminUserUseCase {
    users;
    roles;
    cities;
    provisioning;
    constructor(users, roles, cities, provisioning) {
        this.users = users;
        this.roles = roles;
        this.cities = cities;
        this.provisioning = provisioning;
    }
    async allocateUsuarioFromEmail(emailLocalPart) {
        const base = emailLocalPart
            .replace(/[^a-zA-Z0-9_]/g, '')
            .slice(0, 24)
            .toLowerCase() || 'admin';
        let usuario = base;
        let n = 0;
        while (await this.users.findByUsuario(usuario)) {
            usuario = `${base}${++n}`;
        }
        return usuario;
    }
    async execute(input) {
        const normalized = input.email.trim().toLowerCase();
        const existing = await this.users.findByEmail(normalized);
        if (existing) {
            throw new email_already_taken_error_1.EmailAlreadyTakenError(normalized);
        }
        const systemCity = await this.cities.ensureActiveByName(ADMIN_CITY_NAME);
        const roleId = await this.roles.findIdByCode(user_role_1.UserRole.ADMIN);
        if (!roleId) {
            throw new role_code_not_found_error_1.RoleCodeNotFoundError(user_role_1.UserRole.ADMIN);
        }
        const localPart = normalized.split('@')[0] ?? 'admin';
        const usuario = await this.allocateUsuarioFromEmail(localPart);
        const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
        const userId = (0, node_crypto_1.randomUUID)();
        const phoneNumber = input.phoneNumber?.trim() || null;
        const identification = input.identification?.trim() || null;
        const fullName = input.fullName.trim();
        await this.provisioning.createLinkedAdmin({
            userId,
            usuario,
            email: normalized,
            passwordHash,
            fullName,
            roleId,
            cityId: systemCity.id,
            phoneNumber,
            identification,
            maturityAt: ADMIN_MATURITY_FAR,
        });
        const user = await this.users.findById(userId);
        if (!user) {
            throw new Error('Usuario administrador creado pero no recuperable');
        }
        return {
            message: 'Administrador registrado correctamente. Usa POST /auth/login con el usuario indicado y la contraseña que definiste para obtener el token.',
            usuario: user.usuario,
            email: normalized,
        };
    }
}
exports.CreateAdminUserUseCase = CreateAdminUserUseCase;
//# sourceMappingURL=create-admin-user.use-case.js.map