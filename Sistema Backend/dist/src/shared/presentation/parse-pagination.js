"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePagination = parsePagination;
const common_1 = require("@nestjs/common");
const DEFAULTS = { page: 1, limit: 20, maxLimit: 100 };
function parsePagination(page, limit, maxLimit = DEFAULTS.maxLimit) {
    let pageNum = DEFAULTS.page;
    let limitNum = DEFAULTS.limit;
    if (page !== undefined) {
        pageNum = Number(page);
        if (!Number.isInteger(pageNum) || pageNum < 1) {
            throw new common_1.BadRequestException('page debe ser un entero mayor o igual a 1');
        }
    }
    if (limit !== undefined) {
        limitNum = Number(limit);
        if (!Number.isInteger(limitNum) || limitNum < 1 || limitNum > maxLimit) {
            throw new common_1.BadRequestException(`limit debe ser un entero entre 1 y ${maxLimit}`);
        }
    }
    return { page: pageNum, limit: limitNum, skip: (pageNum - 1) * limitNum };
}
//# sourceMappingURL=parse-pagination.js.map