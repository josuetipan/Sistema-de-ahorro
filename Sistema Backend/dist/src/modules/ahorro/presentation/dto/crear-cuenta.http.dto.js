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
exports.CrearCuentaHttpDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const TIPOS = ['ahorro', 'corriente', 'credito'];
class CrearCuentaHttpDto {
    nombre;
    tipo;
    moneda;
    color;
    icono;
    metaMensual;
    periodoMeses;
}
exports.CrearCuentaHttpDto = CrearCuentaHttpDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1, { message: 'El nombre de la cuenta es requerido' }),
    (0, class_validator_1.MaxLength)(60, { message: 'El nombre admite como máximo 60 caracteres' }),
    (0, class_transformer_1.Transform)(({ value }) => (typeof value === 'string' ? value.trim() : value)),
    __metadata("design:type", String)
], CrearCuentaHttpDto.prototype, "nombre", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(TIPOS, { message: `tipo debe ser uno de: ${TIPOS.join(', ')}` }),
    __metadata("design:type", String)
], CrearCuentaHttpDto.prototype, "tipo", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(3, 3, { message: 'moneda debe tener 3 caracteres (ej: MXN)' }),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim().toUpperCase() : value),
    __metadata("design:type", String)
], CrearCuentaHttpDto.prototype, "moneda", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], CrearCuentaHttpDto.prototype, "color", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(40),
    __metadata("design:type", String)
], CrearCuentaHttpDto.prototype, "icono", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }, { message: 'metaMensual debe ser numérica' }),
    (0, class_validator_1.Min)(1, { message: 'La meta mensual debe ser mayor que cero' }),
    __metadata("design:type", Number)
], CrearCuentaHttpDto.prototype, "metaMensual", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'periodoMeses debe ser numérico' }),
    (0, class_validator_1.Min)(1, { message: 'El período debe ser de al menos 1 mes' }),
    (0, class_validator_1.Max)(120, { message: 'El período no puede superar 120 meses' }),
    __metadata("design:type", Number)
], CrearCuentaHttpDto.prototype, "periodoMeses", void 0);
//# sourceMappingURL=crear-cuenta.http.dto.js.map