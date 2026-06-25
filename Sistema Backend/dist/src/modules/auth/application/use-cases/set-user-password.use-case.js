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
exports.SetUserPasswordUseCase = void 0;
const bcrypt = __importStar(require("bcrypt"));
const user_entity_1 = require("../../domain/user.entity");
const user_not_found_error_1 = require("../../domain/user-not-found.error");
const SALT_ROUNDS = 10;
class SetUserPasswordUseCase {
    users;
    refreshRepo;
    constructor(users, refreshRepo) {
        this.users = users;
        this.refreshRepo = refreshRepo;
    }
    async execute(input) {
        const user = await this.users.findById(input.userId.trim());
        if (!user) {
            throw new user_not_found_error_1.UserNotFoundError();
        }
        const passwordHash = await bcrypt.hash(input.newPassword, SALT_ROUNDS);
        const updated = new user_entity_1.User(user.id, user.usuario, user.email, passwordHash, user.fullName, user.roleId, user.roles, user.isActive, user.cityId, user.cityName, user.maturityAt, user.phoneNumber, user.identification, true);
        await this.users.save(updated);
        await this.refreshRepo.revokeAllForUser(user.id);
    }
}
exports.SetUserPasswordUseCase = SetUserPasswordUseCase;
//# sourceMappingURL=set-user-password.use-case.js.map