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
exports.CreateAdminUserHttpDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class CreateAdminUserHttpDto {
    fullName;
    email;
    password;
    phoneNumber;
    identification;
}
exports.CreateAdminUserHttpDto = CreateAdminUserHttpDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2, { message: 'El nombre debe tener al menos 2 caracteres' }),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim() : value),
    __metadata("design:type", String)
], CreateAdminUserHttpDto.prototype, "fullName", void 0);
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'El correo no es válido' }),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim().toLowerCase() : value),
    __metadata("design:type", String)
], CreateAdminUserHttpDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8, { message: 'La contraseña debe tener al menos 8 caracteres' }),
    __metadata("design:type", String)
], CreateAdminUserHttpDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim() || undefined : value),
    __metadata("design:type", String)
], CreateAdminUserHttpDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim() || undefined : value),
    __metadata("design:type", String)
], CreateAdminUserHttpDto.prototype, "identification", void 0);
//# sourceMappingURL=create-admin-user.http.dto.js.map