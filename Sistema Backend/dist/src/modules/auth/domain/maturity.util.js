"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maturityAtEndOfUtcCalendarDay = maturityAtEndOfUtcCalendarDay;
exports.isMaturityExpired = isMaturityExpired;
function maturityAtEndOfUtcCalendarDay(d) {
    const y = d.getUTCFullYear();
    const m = d.getUTCMonth();
    const day = d.getUTCDate();
    return new Date(Date.UTC(y, m, day, 23, 59, 59, 999));
}
function isMaturityExpired(maturityAt) {
    const y = maturityAt.getUTCFullYear();
    const m = maturityAt.getUTCMonth();
    const d = maturityAt.getUTCDate();
    const endOfDayUtc = Date.UTC(y, m, d, 23, 59, 59, 999);
    return Date.now() > endOfDayUtc;
}
//# sourceMappingURL=maturity.util.js.map