import { RegisterUserUseCase } from '../../application/use-cases/register-user.use-case';
import { LoginUserUseCase } from '../../application/use-cases/login-user.use-case';
import { RefreshSessionUseCase } from '../../application/use-cases/refresh-session.use-case';
import { LogoutUserUseCase } from '../../application/use-cases/logout-user.use-case';
import { ChangePasswordUseCase } from '../../application/use-cases/change-password.use-case';
import { SetUserPasswordUseCase } from '../../application/use-cases/set-user-password.use-case';
import { type AuthUserPayload } from '../../infrastructure/auth/current-user.decorator';
import { RegisterUserHttpDto } from '../dto/register-user.http.dto';
import { LoginUserHttpDto } from '../dto/login-user.http.dto';
import { RefreshTokenHttpDto } from '../dto/refresh-token.http.dto';
import { ChangePasswordHttpDto } from '../dto/change-password.http.dto';
import { SetUserPasswordHttpDto } from '../dto/set-user-password.http.dto';
import { UpdateOwnProfileHttpDto } from '../dto/update-own-profile.http.dto';
import { type UserRepositoryPort } from '../../domain/ports/user.repository.port';
export declare class AuthController {
    private readonly registerUser;
    private readonly loginUser;
    private readonly refreshSession;
    private readonly logoutUser;
    private readonly changePassword;
    private readonly setUserPassword;
    private readonly users;
    constructor(registerUser: RegisterUserUseCase, loginUser: LoginUserUseCase, refreshSession: RefreshSessionUseCase, logoutUser: LogoutUserUseCase, changePassword: ChangePasswordUseCase, setUserPassword: SetUserPasswordUseCase, users: UserRepositoryPort);
    register(body: RegisterUserHttpDto): Promise<{
        id: string;
        usuario: string;
        email: string;
        fullName: string;
        phoneNumber: string;
        identification: string;
        cityId: string;
        cityName: string;
        roles: string[];
        socio?: {
            id: string;
            codigo: string;
            estado: string;
        };
        invitacion: {
            id: string;
            codigo: string;
            activo: boolean;
        };
        temporaryPassword?: string;
        pendingPasswordReset: boolean;
    }>;
    private handleRegisterUser;
    login(body: LoginUserHttpDto): Promise<import("../../application/use-cases/auth-session.dto").AuthSessionDto>;
    refresh(body: RefreshTokenHttpDto): Promise<import("../../application/use-cases/auth-session.dto").AuthSessionDto>;
    logout(body: RefreshTokenHttpDto): Promise<{
        success: boolean;
    }>;
    resetPassword(caller: AuthUserPayload, body: ChangePasswordHttpDto): Promise<{
        success: boolean;
        message: string;
    }>;
    setUserPasswordByAdmin(body: SetUserPasswordHttpDto): Promise<{
        success: boolean;
        message: string;
    }>;
    me(user: AuthUserPayload): {
        id: string;
        usuario: string;
        email: string | null;
        fullName: string;
        cityId: string;
        cityName: string;
        roles: string[];
    };
    updateMe(caller: AuthUserPayload, body: UpdateOwnProfileHttpDto): Promise<import("../../domain/ports/user.repository.port").AdminUserRecord>;
    adminHealth(user: AuthUserPayload): {
        ok: boolean;
        checkedBy: string;
    };
}
