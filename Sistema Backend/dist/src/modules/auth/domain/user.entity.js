"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    id;
    usuario;
    email;
    passwordHash;
    fullName;
    roleId;
    roles;
    isActive;
    cityId;
    cityName;
    maturityAt;
    phoneNumber;
    identification;
    pendingPasswordReset;
    constructor(id, usuario, email, passwordHash, fullName, roleId, roles, isActive, cityId, cityName, maturityAt, phoneNumber = null, identification = null, pendingPasswordReset = true) {
        this.id = id;
        this.usuario = usuario;
        this.email = email;
        this.passwordHash = passwordHash;
        this.fullName = fullName;
        this.roleId = roleId;
        this.roles = roles;
        this.isActive = isActive;
        this.cityId = cityId;
        this.cityName = cityName;
        this.maturityAt = maturityAt;
        this.phoneNumber = phoneNumber;
        this.identification = identification;
        this.pendingPasswordReset = pendingPasswordReset;
    }
}
exports.User = User;
//# sourceMappingURL=user.entity.js.map