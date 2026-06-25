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
exports.ActualizarMetaConfigUseCase = void 0;
const common_1 = require("@nestjs/common");
const ahorro_errors_1 = require("../../domain/ahorro.errors");
const meta_config_repository_port_1 = require("../../domain/ports/meta-config.repository.port");
let ActualizarMetaConfigUseCase = class ActualizarMetaConfigUseCase {
    metaConfig;
    constructor(metaConfig) {
        this.metaConfig = metaConfig;
    }
    async execute(input) {
        const actual = await this.metaConfig.getOrCreate();
        const minima = input.metaMinima ?? actual.metaMinima;
        const maxima = input.metaMaxima ?? actual.metaMaxima;
        if (maxima > 0 && minima > maxima) {
            throw new ahorro_errors_1.MetaConfigInvalidaError();
        }
        return this.metaConfig.actualizar(input);
    }
};
exports.ActualizarMetaConfigUseCase = ActualizarMetaConfigUseCase;
exports.ActualizarMetaConfigUseCase = ActualizarMetaConfigUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(meta_config_repository_port_1.META_CONFIG_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], ActualizarMetaConfigUseCase);
//# sourceMappingURL=actualizar-meta-config.use-case.js.map