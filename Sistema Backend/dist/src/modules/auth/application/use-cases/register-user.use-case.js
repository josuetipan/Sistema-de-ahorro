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
exports.RegisterUserUseCase = void 0;
const node_crypto_1 = require("node:crypto");
const bcrypt = __importStar(require("bcrypt"));
const user_entity_1 = require("../../domain/user.entity");
const user_role_1 = require("../../domain/user-role");
const city_not_found_error_1 = require("../../domain/city-not-found.error");
const email_already_taken_error_1 = require("../../domain/email-already-taken.error");
const role_code_not_found_error_1 = require("../../domain/role-code-not-found.error");
const socio_codigo_already_taken_error_1 = require("../../domain/socio-codigo-already-taken.error");
const SALT_ROUNDS = 10;
const DEFAULT_MATURITY = new Date('2099-12-31T23:59:59.999Z');
const DEFAULT_CITY_NAME = 'General';
function generateTempPassword() {
    return `Tmp${(0, node_crypto_1.randomBytes)(4).toString('hex')}1!`;
}
function generateSocioCodigo() {
    const suffix = (0, node_crypto_1.randomBytes)(3).toString('hex').toUpperCase();
    return `SOC-${suffix}`;
}
function generateInvitacionCodigo(usuario) {
    const base = usuario
        .replace(/[^a-zA-Z0-9]/g, '')
        .slice(0, 4)
        .toUpperCase() || 'USER';
    const suffix = (0, node_crypto_1.randomBytes)(3).toString('hex').toUpperCase();
    return `AHORRO-${base}-${suffix}`;
}
class RegisterUserUseCase {
    users;
    roles;
    cities;
    socios;
    invitaciones;
    constructor(users, roles, cities, socios, invitaciones) {
        this.users = users;
        this.roles = roles;
        this.cities = cities;
        this.socios = socios;
        this.invitaciones = invitaciones;
    }
    async allocateUsuarioFromEmail(emailLocalPart) {
        const base = emailLocalPart
            .replace(/[^a-zA-Z0-9_]/g, '')
            .slice(0, 10)
            .toLowerCase() || 'user';
        let usuario = base;
        let n = 0;
        while (await this.users.findByUsuario(usuario)) {
            const suffix = String(++n);
            usuario = `${base.slice(0, Math.max(1, 10 - suffix.length))}${suffix}`;
        }
        return usuario;
    }
    async resolveSocioCodigo(codigoReferencia) {
        if (codigoReferencia?.trim()) {
            const codigo = codigoReferencia.trim().toUpperCase();
            if (await this.socios.existsByCodigo(codigo)) {
                throw new socio_codigo_already_taken_error_1.SocioCodigoAlreadyTakenError(codigo);
            }
            return codigo;
        }
        let codigo = generateSocioCodigo();
        let attempts = 0;
        while ((await this.socios.existsByCodigo(codigo)) && attempts < 8) {
            codigo = generateSocioCodigo();
            attempts++;
        }
        if (await this.socios.existsByCodigo(codigo)) {
            throw new Error('No se pudo generar un código de socio único');
        }
        return codigo;
    }
    async resolveInvitacionCodigo(usuario) {
        let codigo = generateInvitacionCodigo(usuario);
        let attempts = 0;
        while ((await this.invitaciones.existsByCodigo(codigo)) && attempts < 8) {
            codigo = generateInvitacionCodigo(usuario);
            attempts++;
        }
        if (await this.invitaciones.existsByCodigo(codigo)) {
            throw new Error('No se pudo generar un código de invitación único');
        }
        return codigo;
    }
    async execute(input) {
        const email = input.email.trim().toLowerCase();
        if (await this.users.findByEmail(email)) {
            throw new email_already_taken_error_1.EmailAlreadyTakenError(email);
        }
        const roleId = await this.roles.findIdByCode(input.roleCode);
        if (!roleId) {
            throw new role_code_not_found_error_1.RoleCodeNotFoundError(input.roleCode);
        }
        let cityId = input.cityId?.trim();
        let cityName;
        if (cityId) {
            const city = await this.cities.findActiveById(cityId);
            if (!city) {
                throw new city_not_found_error_1.CityNotFoundError();
            }
            cityId = city.id;
            cityName = city.name;
        }
        else {
            const city = await this.cities.ensureActiveByName(DEFAULT_CITY_NAME);
            cityId = city.id;
            cityName = city.name;
        }
        const localPart = email.split('@')[0] ?? 'user';
        const usuario = await this.allocateUsuarioFromEmail(localPart);
        const plainPassword = input.password?.trim() || generateTempPassword();
        const pendingPasswordReset = !input.password?.trim();
        const passwordHash = await bcrypt.hash(plainPassword, SALT_ROUNDS);
        const user = new user_entity_1.User((0, node_crypto_1.randomUUID)(), usuario, email, passwordHash, input.fullName.trim(), roleId, [input.roleCode], true, cityId, cityName, DEFAULT_MATURITY, input.phoneNumber.trim(), input.identification.trim(), pendingPasswordReset);
        await this.users.save(user);
        let socio;
        if (input.roleCode === user_role_1.UserRole.CUSTOMER) {
            const codigo = await this.resolveSocioCodigo(input.codigoReferencia);
            const created = await this.socios.create({
                userId: user.id,
                codigo,
                estado: 'pendiente',
            });
            socio = {
                id: created.idSocio,
                codigo: created.codigo,
                estado: created.estado,
            };
        }
        const codigoInvitacion = await this.resolveInvitacionCodigo(user.usuario);
        const invitacionCreada = await this.invitaciones.create({
            userId: user.id,
            codigo: codigoInvitacion,
        });
        return {
            id: user.id,
            usuario: user.usuario,
            email,
            fullName: user.fullName,
            phoneNumber: user.phoneNumber ?? input.phoneNumber.trim(),
            identification: user.identification ?? input.identification.trim(),
            cityId: user.cityId,
            cityName: user.cityName,
            roles: [...user.roles],
            socio,
            invitacion: {
                id: invitacionCreada.idInvitacion,
                codigo: invitacionCreada.codigo,
                activo: invitacionCreada.activo,
            },
            temporaryPassword: pendingPasswordReset ? plainPassword : undefined,
            pendingPasswordReset,
        };
    }
}
exports.RegisterUserUseCase = RegisterUserUseCase;
//# sourceMappingURL=register-user.use-case.js.map