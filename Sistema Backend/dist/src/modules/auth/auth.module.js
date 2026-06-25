"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const user_repository_port_1 = require("./domain/ports/user.repository.port");
const role_repository_port_1 = require("./domain/ports/role.repository.port");
const socio_repository_port_1 = require("./domain/ports/socio.repository.port");
const invitacion_repository_port_1 = require("./domain/ports/invitacion.repository.port");
const city_repository_port_1 = require("./domain/ports/city.repository.port");
const admin_user_provisioning_port_1 = require("./domain/ports/admin-user-provisioning.port");
const refresh_token_repository_port_1 = require("./domain/ports/refresh-token.repository.port");
const auth_token_port_1 = require("./domain/ports/auth-token.port");
const register_user_use_case_1 = require("./application/use-cases/register-user.use-case");
const login_user_use_case_1 = require("./application/use-cases/login-user.use-case");
const refresh_session_use_case_1 = require("./application/use-cases/refresh-session.use-case");
const logout_user_use_case_1 = require("./application/use-cases/logout-user.use-case");
const change_password_use_case_1 = require("./application/use-cases/change-password.use-case");
const set_user_password_use_case_1 = require("./application/use-cases/set-user-password.use-case");
const create_role_use_case_1 = require("./application/use-cases/create-role.use-case");
const create_admin_user_use_case_1 = require("./application/use-cases/create-admin-user.use-case");
const prisma_user_repository_1 = require("./infrastructure/persistence/prisma/prisma-user.repository");
const prisma_role_repository_1 = require("./infrastructure/persistence/prisma/prisma-role.repository");
const prisma_city_repository_1 = require("./infrastructure/persistence/prisma/prisma-city.repository");
const prisma_admin_user_provisioning_repository_1 = require("./infrastructure/persistence/prisma/prisma-admin-user-provisioning.repository");
const prisma_refresh_token_repository_1 = require("./infrastructure/persistence/prisma/prisma-refresh-token.repository");
const prisma_socio_repository_1 = require("./infrastructure/persistence/prisma/prisma-socio.repository");
const prisma_invitacion_repository_1 = require("./infrastructure/persistence/prisma/prisma-invitacion.repository");
const jwt_auth_token_adapter_1 = require("./infrastructure/auth/jwt-auth-token.adapter");
const jwt_access_secret_1 = require("./infrastructure/auth/jwt-access-secret");
const jwt_access_strategy_1 = require("./infrastructure/auth/jwt-access.strategy");
const roles_guard_1 = require("./infrastructure/auth/roles.guard");
const auth_controller_1 = require("./presentation/controllers/auth.controller");
const role_controller_1 = require("./presentation/controllers/role.controller");
const admin_controller_1 = require("./presentation/controllers/admin.controller");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            jwt_1.JwtModule.register({
                secret: (0, jwt_access_secret_1.getJwtAccessSecret)(),
            }),
        ],
        controllers: [auth_controller_1.AuthController, role_controller_1.RoleController, admin_controller_1.AdminController],
        providers: [
            prisma_user_repository_1.PrismaUserRepository,
            prisma_role_repository_1.PrismaRoleRepository,
            prisma_city_repository_1.PrismaCityRepository,
            prisma_admin_user_provisioning_repository_1.PrismaAdminUserProvisioningRepository,
            prisma_refresh_token_repository_1.PrismaRefreshTokenRepository,
            prisma_socio_repository_1.PrismaSocioRepository,
            prisma_invitacion_repository_1.PrismaInvitacionRepository,
            jwt_auth_token_adapter_1.JwtAuthTokenAdapter,
            jwt_access_strategy_1.JwtAccessStrategy,
            roles_guard_1.RolesGuard,
            {
                provide: user_repository_port_1.USER_REPOSITORY,
                useExisting: prisma_user_repository_1.PrismaUserRepository,
            },
            {
                provide: role_repository_port_1.ROLE_REPOSITORY,
                useExisting: prisma_role_repository_1.PrismaRoleRepository,
            },
            {
                provide: city_repository_port_1.CITY_REPOSITORY,
                useExisting: prisma_city_repository_1.PrismaCityRepository,
            },
            {
                provide: admin_user_provisioning_port_1.ADMIN_USER_PROVISIONING,
                useExisting: prisma_admin_user_provisioning_repository_1.PrismaAdminUserProvisioningRepository,
            },
            {
                provide: refresh_token_repository_port_1.REFRESH_TOKEN_REPOSITORY,
                useExisting: prisma_refresh_token_repository_1.PrismaRefreshTokenRepository,
            },
            {
                provide: socio_repository_port_1.SOCIO_REPOSITORY,
                useExisting: prisma_socio_repository_1.PrismaSocioRepository,
            },
            {
                provide: invitacion_repository_port_1.INVITACION_REPOSITORY,
                useExisting: prisma_invitacion_repository_1.PrismaInvitacionRepository,
            },
            {
                provide: auth_token_port_1.AUTH_TOKEN_PORT,
                useExisting: jwt_auth_token_adapter_1.JwtAuthTokenAdapter,
            },
            {
                provide: register_user_use_case_1.RegisterUserUseCase,
                useFactory: (users, roles, cities, socios, invitaciones) => new register_user_use_case_1.RegisterUserUseCase(users, roles, cities, socios, invitaciones),
                inject: [
                    user_repository_port_1.USER_REPOSITORY,
                    role_repository_port_1.ROLE_REPOSITORY,
                    city_repository_port_1.CITY_REPOSITORY,
                    socio_repository_port_1.SOCIO_REPOSITORY,
                    invitacion_repository_port_1.INVITACION_REPOSITORY,
                ],
            },
            {
                provide: login_user_use_case_1.LoginUserUseCase,
                useFactory: (users, refresh, tokens) => new login_user_use_case_1.LoginUserUseCase(users, refresh, tokens),
                inject: [user_repository_port_1.USER_REPOSITORY, refresh_token_repository_port_1.REFRESH_TOKEN_REPOSITORY, auth_token_port_1.AUTH_TOKEN_PORT],
            },
            {
                provide: refresh_session_use_case_1.RefreshSessionUseCase,
                useFactory: (users, refresh, tokens) => new refresh_session_use_case_1.RefreshSessionUseCase(users, refresh, tokens),
                inject: [user_repository_port_1.USER_REPOSITORY, refresh_token_repository_port_1.REFRESH_TOKEN_REPOSITORY, auth_token_port_1.AUTH_TOKEN_PORT],
            },
            {
                provide: logout_user_use_case_1.LogoutUserUseCase,
                useFactory: (refresh, tokens) => new logout_user_use_case_1.LogoutUserUseCase(refresh, tokens),
                inject: [refresh_token_repository_port_1.REFRESH_TOKEN_REPOSITORY, auth_token_port_1.AUTH_TOKEN_PORT],
            },
            {
                provide: change_password_use_case_1.ChangePasswordUseCase,
                useFactory: (users, refresh) => new change_password_use_case_1.ChangePasswordUseCase(users, refresh),
                inject: [user_repository_port_1.USER_REPOSITORY, refresh_token_repository_port_1.REFRESH_TOKEN_REPOSITORY],
            },
            {
                provide: set_user_password_use_case_1.SetUserPasswordUseCase,
                useFactory: (users, refresh) => new set_user_password_use_case_1.SetUserPasswordUseCase(users, refresh),
                inject: [user_repository_port_1.USER_REPOSITORY, refresh_token_repository_port_1.REFRESH_TOKEN_REPOSITORY],
            },
            {
                provide: create_role_use_case_1.CreateRoleUseCase,
                useFactory: (roles) => new create_role_use_case_1.CreateRoleUseCase(roles),
                inject: [role_repository_port_1.ROLE_REPOSITORY],
            },
            {
                provide: create_admin_user_use_case_1.CreateAdminUserUseCase,
                useFactory: (users, roles, cities, provisioning) => new create_admin_user_use_case_1.CreateAdminUserUseCase(users, roles, cities, provisioning),
                inject: [
                    user_repository_port_1.USER_REPOSITORY,
                    role_repository_port_1.ROLE_REPOSITORY,
                    city_repository_port_1.CITY_REPOSITORY,
                    admin_user_provisioning_port_1.ADMIN_USER_PROVISIONING,
                ],
            },
        ],
        exports: [roles_guard_1.RolesGuard, jwt_access_strategy_1.JwtAccessStrategy, user_repository_port_1.USER_REPOSITORY],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map