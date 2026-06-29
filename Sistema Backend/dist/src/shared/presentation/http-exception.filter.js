"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var HttpExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const node_http_1 = require("node:http");
let HttpExceptionFilter = HttpExceptionFilter_1 = class HttpExceptionFilter {
    logger = new common_1.Logger(HttpExceptionFilter_1.name);
    catch(exception, host) {
        const response = host.switchToHttp().getResponse();
        let code = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let body = { message: 'Error interno del servidor' };
        if (exception instanceof common_1.HttpException) {
            code = exception.getStatus();
            const res = exception.getResponse();
            body = typeof res === 'string' ? { message: res } : res;
        }
        else {
            this.logger.error('Excepción no controlada', exception instanceof Error ? exception.stack : String(exception));
        }
        response.status(code).json({
            code,
            status: node_http_1.STATUS_CODES[code] ?? 'Error',
            body,
        });
    }
};
exports.HttpExceptionFilter = HttpExceptionFilter;
exports.HttpExceptionFilter = HttpExceptionFilter = HttpExceptionFilter_1 = __decorate([
    (0, common_1.Catch)()
], HttpExceptionFilter);
//# sourceMappingURL=http-exception.filter.js.map