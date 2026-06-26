"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CityNotFoundError = void 0;
class CityNotFoundError extends Error {
    constructor(message = 'La ciudad no existe o está inactiva') {
        super(message);
        this.name = 'CityNotFoundError';
    }
}
exports.CityNotFoundError = CityNotFoundError;
//# sourceMappingURL=city-not-found.error.js.map