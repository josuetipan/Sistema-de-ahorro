import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import {
  USER_REPOSITORY,
  type UserRepositoryPort,
} from './domain/ports/user.repository.port';
import {
  ROLE_REPOSITORY,
  type RoleRepositoryPort,
} from './domain/ports/role.repository.port';
import {
  SOCIO_REPOSITORY,
  type SocioRepositoryPort,
} from './domain/ports/socio.repository.port';
import {
  INVITACION_REPOSITORY,
  type InvitacionRepositoryPort,
} from './domain/ports/invitacion.repository.port';
import {
  CITY_REPOSITORY,
  type CityRepositoryPort,
} from './domain/ports/city.repository.port';
import {
  ADMIN_USER_PROVISIONING,
  type AdminUserProvisioningPort,
} from './domain/ports/admin-user-provisioning.port';
import {
  REFRESH_TOKEN_REPOSITORY,
  type RefreshTokenRepositoryPort,
} from './domain/ports/refresh-token.repository.port';
import {
  AUTH_TOKEN_PORT,
  type AuthTokenPort,
} from './domain/ports/auth-token.port';
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case';
import { LoginUserUseCase } from './application/use-cases/login-user.use-case';
import { RefreshSessionUseCase } from './application/use-cases/refresh-session.use-case';
import { LogoutUserUseCase } from './application/use-cases/logout-user.use-case';
import { ChangePasswordUseCase } from './application/use-cases/change-password.use-case';
import { SetUserPasswordUseCase } from './application/use-cases/set-user-password.use-case';
import { CreateRoleUseCase } from './application/use-cases/create-role.use-case';
import { CreateAdminUserUseCase } from './application/use-cases/create-admin-user.use-case';
import { PrismaUserRepository } from './infrastructure/persistence/prisma/prisma-user.repository';
import { PrismaRoleRepository } from './infrastructure/persistence/prisma/prisma-role.repository';
import { PrismaCityRepository } from './infrastructure/persistence/prisma/prisma-city.repository';
import { PrismaAdminUserProvisioningRepository } from './infrastructure/persistence/prisma/prisma-admin-user-provisioning.repository';
import { PrismaRefreshTokenRepository } from './infrastructure/persistence/prisma/prisma-refresh-token.repository';
import { PrismaSocioRepository } from './infrastructure/persistence/prisma/prisma-socio.repository';
import { PrismaInvitacionRepository } from './infrastructure/persistence/prisma/prisma-invitacion.repository';
import { JwtAuthTokenAdapter } from './infrastructure/auth/jwt-auth-token.adapter';
import { getJwtAccessSecret } from './infrastructure/auth/jwt-access-secret';
import { JwtAccessStrategy } from './infrastructure/auth/jwt-access.strategy';
import { RolesGuard } from './infrastructure/auth/roles.guard';
import { AuthController } from './presentation/controllers/auth.controller';
import { RoleController } from './presentation/controllers/role.controller';
import { AdminController } from './presentation/controllers/admin.controller';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: getJwtAccessSecret(),
    }),
  ],
  controllers: [AuthController, RoleController, AdminController],
  providers: [
    PrismaUserRepository,
    PrismaRoleRepository,
    PrismaCityRepository,
    PrismaAdminUserProvisioningRepository,
    PrismaRefreshTokenRepository,
    PrismaSocioRepository,
    PrismaInvitacionRepository,
    JwtAuthTokenAdapter,
    JwtAccessStrategy,
    RolesGuard,
    {
      provide: USER_REPOSITORY,
      useExisting: PrismaUserRepository,
    },
    {
      provide: ROLE_REPOSITORY,
      useExisting: PrismaRoleRepository,
    },
    {
      provide: CITY_REPOSITORY,
      useExisting: PrismaCityRepository,
    },
    {
      provide: ADMIN_USER_PROVISIONING,
      useExisting: PrismaAdminUserProvisioningRepository,
    },
    {
      provide: REFRESH_TOKEN_REPOSITORY,
      useExisting: PrismaRefreshTokenRepository,
    },
    {
      provide: SOCIO_REPOSITORY,
      useExisting: PrismaSocioRepository,
    },
    {
      provide: INVITACION_REPOSITORY,
      useExisting: PrismaInvitacionRepository,
    },
    {
      provide: AUTH_TOKEN_PORT,
      useExisting: JwtAuthTokenAdapter,
    },
    {
      provide: RegisterUserUseCase,
      useFactory: (
        users: UserRepositoryPort,
        roles: RoleRepositoryPort,
        cities: CityRepositoryPort,
        socios: SocioRepositoryPort,
        invitaciones: InvitacionRepositoryPort,
      ) => new RegisterUserUseCase(users, roles, cities, socios, invitaciones),
      inject: [
        USER_REPOSITORY,
        ROLE_REPOSITORY,
        CITY_REPOSITORY,
        SOCIO_REPOSITORY,
        INVITACION_REPOSITORY,
      ],
    },
    {
      provide: LoginUserUseCase,
      useFactory: (
        users: UserRepositoryPort,
        refresh: RefreshTokenRepositoryPort,
        tokens: AuthTokenPort,
      ) => new LoginUserUseCase(users, refresh, tokens),
      inject: [USER_REPOSITORY, REFRESH_TOKEN_REPOSITORY, AUTH_TOKEN_PORT],
    },
    {
      provide: RefreshSessionUseCase,
      useFactory: (
        users: UserRepositoryPort,
        refresh: RefreshTokenRepositoryPort,
        tokens: AuthTokenPort,
      ) => new RefreshSessionUseCase(users, refresh, tokens),
      inject: [USER_REPOSITORY, REFRESH_TOKEN_REPOSITORY, AUTH_TOKEN_PORT],
    },
    {
      provide: LogoutUserUseCase,
      useFactory: (
        refresh: RefreshTokenRepositoryPort,
        tokens: AuthTokenPort,
      ) => new LogoutUserUseCase(refresh, tokens),
      inject: [REFRESH_TOKEN_REPOSITORY, AUTH_TOKEN_PORT],
    },
    {
      provide: ChangePasswordUseCase,
      useFactory: (
        users: UserRepositoryPort,
        refresh: RefreshTokenRepositoryPort,
      ) => new ChangePasswordUseCase(users, refresh),
      inject: [USER_REPOSITORY, REFRESH_TOKEN_REPOSITORY],
    },
    {
      provide: SetUserPasswordUseCase,
      useFactory: (
        users: UserRepositoryPort,
        refresh: RefreshTokenRepositoryPort,
      ) => new SetUserPasswordUseCase(users, refresh),
      inject: [USER_REPOSITORY, REFRESH_TOKEN_REPOSITORY],
    },
    {
      provide: CreateRoleUseCase,
      useFactory: (roles: RoleRepositoryPort) => new CreateRoleUseCase(roles),
      inject: [ROLE_REPOSITORY],
    },
    {
      provide: CreateAdminUserUseCase,
      useFactory: (
        users: UserRepositoryPort,
        roles: RoleRepositoryPort,
        cities: CityRepositoryPort,
        provisioning: AdminUserProvisioningPort,
      ) => new CreateAdminUserUseCase(users, roles, cities, provisioning),
      inject: [
        USER_REPOSITORY,
        ROLE_REPOSITORY,
        CITY_REPOSITORY,
        ADMIN_USER_PROVISIONING,
      ],
    },
  ],
  exports: [RolesGuard, JwtAccessStrategy, USER_REPOSITORY],
})
export class AuthModule {}
