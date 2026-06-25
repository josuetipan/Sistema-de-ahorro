"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUserHttpDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const user_role_1 = require("../../domain/user-role");
function collapseInternalSpaces(value) {
    return value.trim().replace(/\s+/g, ' ');
}
const ASSIGNABLE_ROLES = [
    user_role_1.UserRole.ADMIN,
    user_role_1.UserRole.OPERATOR,
    user_role_1.UserRole.CUSTOMER,
];
class RegisterUserHttpDto {
    fullName;
    identification;
    email;
    phoneNumber;
    roleCode;
    codigoReferencia;
    password;
    cityId;
}
exports.RegisterUserHttpDto = RegisterUserHttpDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1, { message: 'El nombre completo es requerido' }),
    (0, class_validator_1.MaxLength)(60, {
        message: 'El nombre completo admite como máximo 60 caracteres',
    }),
    (0, class_validator_1.Matches)(/^[\p{L} ]+$/u, {
        message: 'El nombre completo solo permite letras y espacios',
    }),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? collapseInternalSpaces(value) : value),
    __metadata("design:type", String)
], RegisterUserHttpDto.prototype, "fullName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1, { message: 'La cédula es obligatoria' }),
    (0, class_validator_1.MaxLength)(20, {
        message: 'La cédula admite como máximo 20 caracteres',
    }),
    (0, class_validator_1.Matches)(/^[\p{L}\p{N}]+$/u, {
        message: 'La cédula solo permite letras y números',
    }),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim() : value),
    __metadata("design:type", String)
], RegisterUserHttpDto.prototype, "identification", void 0);
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'El correo no es válido' }),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim().toLowerCase() : value),
    __metadata("design:type", String)
], RegisterUserHttpDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(7, { message: 'El teléfono debe tener al menos 7 caracteres' }),
    (0, class_validator_1.MaxLength)(20, { message: 'El teléfono admite como máximo 20 caracteres' }),
    (0, class_validator_1.Matches)(/^[\d+\s()-]+$/, {
        message: 'El teléfono solo permite números, espacios, +, - y paréntesis',
    }),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim() : value),
    __metadata("design:type", String)
], RegisterUserHttpDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, class_validator_1.IsIn)(ASSIGNABLE_ROLES, {
        message: `roleCode debe ser uno de: ${ASSIGNABLE_ROLES.join(', ')}`,
    }),
    __metadata("design:type", String)
], RegisterUserHttpDto.prototype, "roleCode", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20, {
        message: 'El código de referencia admite como máximo 20 caracteres',
    }),
    (0, class_validator_1.Matches)(/^SOC-[A-Z0-9]{4,12}$/i, {
        message: 'El código debe tener el formato SOC-XXXXXX (letras y números)',
    }),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim().toUpperCase() : value),
    __metadata("design:type", String)
], RegisterUserHttpDto.prototype, "codigoReferencia", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8, { message: 'La contraseña debe tener al menos 8 caracteres' }),
    (0, class_validator_1.MaxLength)(20, {
        message: 'La contraseña admite como máximo 20 caracteres',
    }),
    (0, class_validator_1.Matches)(/^[\p{L}\p{N}\p{P}\p{S}]+$/u, {
        message: 'La contraseña solo permite letras, números y caracteres especiales (sin emojis)',
    }),
    __metadata("design:type", String)
], RegisterUserHttpDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4', { message: 'cityId debe ser un UUID válido' }),
    __metadata("design:type", String)
], RegisterUserHttpDto.prototype, "cityId", void 0);
//# sourceMappingURL=register-user.http.dto.js.map