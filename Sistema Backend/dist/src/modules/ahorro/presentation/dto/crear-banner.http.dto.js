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
exports.CrearBannerHttpDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class CrearBannerHttpDto {
    titulo;
    subtitulo;
    orden;
    activo;
}
exports.CrearBannerHttpDto = CrearBannerHttpDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1, { message: 'El título es requerido' }),
    (0, class_validator_1.MaxLength)(120, { message: 'El título admite como máximo 120 caracteres' }),
    (0, class_transformer_1.Transform)(({ value }) => (typeof value === 'string' ? value.trim() : value)),
    __metadata("design:type", String)
], CrearBannerHttpDto.prototype, "titulo", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim() || null : value),
    __metadata("design:type", Object)
], CrearBannerHttpDto.prototype, "subtitulo", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({ message: 'orden debe ser un entero' }),
    (0, class_validator_1.Min)(0, { message: 'orden no puede ser negativo' }),
    __metadata("design:type", Number)
], CrearBannerHttpDto.prototype, "orden", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === undefined ? undefined : value === 'true' || value === true),
    (0, class_validator_1.IsBoolean)({ message: 'activo debe ser booleano' }),
    __metadata("design:type", Boolean)
], CrearBannerHttpDto.prototype, "activo", void 0);
//# sourceMappingURL=crear-banner.http.dto.js.map