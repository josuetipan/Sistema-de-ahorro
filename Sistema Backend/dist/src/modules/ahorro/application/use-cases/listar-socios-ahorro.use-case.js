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
exports.ListarSociosAhorroUseCase = void 0;
const common_1 = require("@nestjs/common");
const pagination_1 = require("../../../../shared/application/pagination");
const cuenta_repository_port_1 = require("../../domain/ports/cuenta.repository.port");
let ListarSociosAhorroUseCase = class ListarSociosAhorroUseCase {
    cuentas;
    constructor(cuentas) {
        this.cuentas = cuentas;
    }
    async execute(input) {
        const { items, total } = await this.cuentas.listSociosCustomer({
            page: input.page,
            limit: input.limit,
            q: input.q,
            estado: input.estado,
            codigo: input.codigo,
            nombre: input.nombre,
            email: input.email,
            identification: input.identification,
            cuentaEstado: input.cuentaEstado,
        });
        return (0, pagination_1.paginate)(items, total, input.page, input.limit);
    }
};
exports.ListarSociosAhorroUseCase = ListarSociosAhorroUseCase;
exports.ListarSociosAhorroUseCase = ListarSociosAhorroUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(cuenta_repository_port_1.CUENTA_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], ListarSociosAhorroUseCase);
//# sourceMappingURL=listar-socios-ahorro.use-case.js.map