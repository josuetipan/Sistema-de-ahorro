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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const invalid_credentials_error_1 = require("../../domain/invalid-credentials.error");
const user_inactive_error_1 = require("../../domain/user-inactive.error");
const maturity_expired_error_1 = require("../../domain/maturity-expired.error");
const invalid_refresh_token_error_1 = require("../../domain/invalid-refresh-token.error");
const city_not_found_error_1 = require("../../domain/city-not-found.error");
const role_code_not_found_error_1 = require("../../domain/role-code-not-found.error");
const email_already_taken_error_1 = require("../../domain/email-already-taken.error");
const socio_codigo_already_taken_error_1 = require("../../domain/socio-codigo-already-taken.error");
const user_role_1 = require("../../domain/user-role");
const register_user_use_case_1 = require("../../application/use-cases/register-user.use-case");
const login_user_use_case_1 = require("../../application/use-cases/login-user.use-case");
const refresh_session_use_case_1 = require("../../application/use-cases/refresh-session.use-case");
const logout_user_use_case_1 = require("../../application/use-cases/logout-user.use-case");
const change_password_use_case_1 = require("../../application/use-cases/change-password.use-case");
const set_user_password_use_case_1 = require("../../application/use-cases/set-user-password.use-case");
const user_not_found_error_1 = require("../../domain/user-not-found.error");
const same_new_password_error_1 = require("../../domain/same-new-password.error");
const roles_decorator_1 = require("../../infrastructure/auth/roles.decorator");
const roles_guard_1 = require("../../infrastructure/auth/roles.guard");
const current_user_decorator_1 = require("../../infrastructure/auth/current-user.decorator");
const register_user_http_dto_1 = require("../dto/register-user.http.dto");
const login_user_http_dto_1 = require("../dto/login-user.http.dto");
const refresh_token_http_dto_1 = require("../dto/refresh-token.http.dto");
const change_password_http_dto_1 = require("../dto/change-password.http.dto");
const set_user_password_http_dto_1 = require("../dto/set-user-password.http.dto");
let AuthController = class AuthController {
    registerUser;
    loginUser;
    refreshSession;
    logoutUser;
    changePassword;
    setUserPassword;
    constructor(registerUser, loginUser, refreshSession, logoutUser, changePassword, setUserPassword) {
        this.registerUser = registerUser;
        this.loginUser = loginUser;
        this.refreshSession = refreshSession;
        this.logoutUser = logoutUser;
        this.changePassword = changePassword;
        this.setUserPassword = setUserPassword;
    }
    async register(body) {
        return this.handleRegisterUser(body);
    }
    async handleRegisterUser(body) {
        try {
            return await this.registerUser.execute({
                fullName: body.fullName,
                identification: body.identification,
                email: body.email,
                phoneNumber: body.phoneNumber,
                roleCode: body.roleCode,
                codigoReferencia: body.codigoReferencia,
                password: body.password,
                cityId: body.cityId,
            });
        }
        catch (err) {
            if (err instanceof email_already_taken_error_1.EmailAlreadyTakenError) {
                throw new common_1.ConflictException(err.message);
            }
            if (err instanceof socio_codigo_already_taken_error_1.SocioCodigoAlreadyTakenError) {
                throw new common_1.ConflictException(err.message);
            }
            if (err instanceof city_not_found_error_1.CityNotFoundError) {
                throw new common_1.BadRequestException(err.message);
            }
            if (err instanceof role_code_not_found_error_1.RoleCodeNotFoundError) {
                throw new common_1.BadRequestException(err.message);
            }
            throw new common_1.InternalServerErrorException();
        }
    }
    async login(body) {
        try {
            return await this.loginUser.execute({
                usuario: body.usuario ?? body.email ?? '',
                password: body.password,
            });
        }
        catch (err) {
            if (err instanceof user_inactive_error_1.UserInactiveError) {
                throw new common_1.ForbiddenException(err.message);
            }
            if (err instanceof maturity_expired_error_1.MaturityExpiredError) {
                throw new common_1.ForbiddenException(err.message);
            }
            if (err instanceof invalid_credentials_error_1.InvalidCredentialsError) {
                throw new common_1.UnauthorizedException(err.message);
            }
            throw new common_1.InternalServerErrorException();
        }
    }
    async refresh(body) {
        try {
            return await this.refreshSession.execute(body.refreshToken);
        }
        catch (err) {
            if (err instanceof invalid_refresh_token_error_1.InvalidRefreshTokenError) {
                throw new common_1.UnauthorizedException(err.message);
            }
            throw new common_1.InternalServerErrorException();
        }
    }
    async logout(body) {
        await this.logoutUser.execute(body.refreshToken);
        return { success: true };
    }
    async resetPassword(caller, body) {
        if (body.idUsuario !== caller.id) {
            throw new common_1.ForbiddenException('idUsuario no coincide con el usuario del token');
        }
        try {
            await this.changePassword.execute({
                userId: caller.id,
                currentPassword: body.currentPassword,
                newPassword: body.newPassword,
            });
            return { success: true, message: 'Contraseña actualizada' };
        }
        catch (err) {
            if (err instanceof user_not_found_error_1.UserNotFoundError) {
                throw new common_1.NotFoundException(err.message);
            }
            if (err instanceof same_new_password_error_1.SameNewPasswordError) {
                throw new common_1.BadRequestException(err.message);
            }
            if (err instanceof invalid_credentials_error_1.InvalidCredentialsError) {
                throw new common_1.UnauthorizedException(err.message);
            }
            throw new common_1.InternalServerErrorException();
        }
    }
    async setUserPasswordByAdmin(body) {
        try {
            await this.setUserPassword.execute({
                userId: body.idUsuario,
                newPassword: body.newPassword,
            });
            return {
                success: true,
                message: 'Contraseña actualizada; el usuario debe restablecerla en el flujo correspondiente',
            };
        }
        catch (err) {
            if (err instanceof user_not_found_error_1.UserNotFoundError) {
                throw new common_1.NotFoundException(err.message);
            }
            throw new common_1.InternalServerErrorException();
        }
    }
    me(user) {
        return {
            id: user.id,
            usuario: user.usuario,
            email: user.email,
            fullName: user.fullName,
            cityId: user.cityId,
            cityName: user.cityName,
            roles: user.roles,
        };
    }
    adminHealth(user) {
        return { ok: true, checkedBy: user.usuario };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_1.UserRole.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_user_http_dto_1.RegisterUserHttpDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_user_http_dto_1.LoginUserHttpDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [refresh_token_http_dto_1.RefreshTokenHttpDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [refresh_token_http_dto_1.RefreshTokenHttpDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.HttpCode)(200),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, change_password_http_dto_1.ChangePasswordHttpDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Put)('user/password'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_1.UserRole.ADMIN),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [set_user_password_http_dto_1.SetUserPasswordHttpDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "setUserPasswordByAdmin", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "me", null);
__decorate([
    (0, common_1.Get)('admin/health'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_1.UserRole.ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "adminHealth", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [register_user_use_case_1.RegisterUserUseCase,
        login_user_use_case_1.LoginUserUseCase,
        refresh_session_use_case_1.RefreshSessionUseCase,
        logout_user_use_case_1.LogoutUserUseCase,
        change_password_use_case_1.ChangePasswordUseCase,
        set_user_password_use_case_1.SetUserPasswordUseCase])
], AuthController);
//# sourceMappingURL=auth.controller.js.map