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
exports.ListarAportesUseCase = void 0;
const common_1 = require("@nestjs/common");
const pagination_1 = require("../../../../shared/application/pagination");
const aporte_repository_port_1 = require("../../domain/ports/aporte.repository.port");
let ListarAportesUseCase = class ListarAportesUseCase {
    aportes;
    constructor(aportes) {
        this.aportes = aportes;
    }
    async execute(filtro) {
        const { items, total } = await this.aportes.listForAdmin(filtro);
        return (0, pagination_1.paginate)(items, total, filtro.page, filtro.limit);
    }
};
exports.ListarAportesUseCase = ListarAportesUseCase;
exports.ListarAportesUseCase = ListarAportesUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(aporte_repository_port_1.APORTE_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], ListarAportesUseCase);
//# sourceMappingURL=listar-aportes.use-case.js.map