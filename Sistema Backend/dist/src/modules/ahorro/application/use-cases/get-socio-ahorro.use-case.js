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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSocioAhorroUseCase = void 0;
const common_1 = require("@nestjs/common");
const ahorro_errors_1 = require("../../domain/ahorro.errors");
const cuenta_repository_port_1 = require("../../domain/ports/cuenta.repository.port");
let GetSocioAhorroUseCase = class GetSocioAhorroUseCase {
    cuentas;
    constructor(cuentas) {
        this.cuentas = cuentas;
    }
    async execute(socioId) {
        const socio = await this.cuentas.getSocioCustomer(socioId);
        if (!socio) {
            throw new ahorro_errors_1.SocioNotFoundError();
        }
        return socio;
    }
};
exports.GetSocioAhorroUseCase = GetSocioAhorroUseCase;
exports.GetSocioAhorroUseCase = GetSocioAhorroUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(cuenta_repository_port_1.CUENTA_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], GetSocioAhorroUseCase);
//# sourceMappingURL=get-socio-ahorro.use-case.js.map