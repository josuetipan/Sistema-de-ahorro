import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  InternalServerErrorException,
  NotFoundException,
  Post,
  Put,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InvalidCredentialsError } from '../../domain/invalid-credentials.error';
import { UserInactiveError } from '../../domain/user-inactive.error';
import { MaturityExpiredError } from '../../domain/maturity-expired.error';
import { InvalidRefreshTokenError } from '../../domain/invalid-refresh-token.error';
import { CityNotFoundError } from '../../domain/city-not-found.error';
import { RoleCodeNotFoundError } from '../../domain/role-code-not-found.error';
import { EmailAlreadyTakenError } from '../../domain/email-already-taken.error';
import { SocioCodigoAlreadyTakenError } from '../../domain/socio-codigo-already-taken.error';
import { UserRole } from '../../domain/user-role';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.use-case';
import { LoginUserUseCase } from '../../application/use-cases/login-user.use-case';
import { RefreshSessionUseCase } from '../../application/use-cases/refresh-session.use-case';
import { LogoutUserUseCase } from '../../application/use-cases/logout-user.use-case';
import { ChangePasswordUseCase } from '../../application/use-cases/change-password.use-case';
import { SetUserPasswordUseCase } from '../../application/use-cases/set-user-password.use-case';
import { UserNotFoundError } from '../../domain/user-not-found.error';
import { SameNewPasswordError } from '../../domain/same-new-password.error';
import { Roles } from '../../infrastructure/auth/roles.decorator';
import { RolesGuard } from '../../infrastructure/auth/roles.guard';
import {
  CurrentUser,
  type AuthUserPayload,
} from '../../infrastructure/auth/current-user.decorator';
import { RegisterUserHttpDto } from '../dto/register-user.http.dto';
import { LoginUserHttpDto } from '../dto/login-user.http.dto';
import { RefreshTokenHttpDto } from '../dto/refresh-token.http.dto';
import { ChangePasswordHttpDto } from '../dto/change-password.http.dto';
import { SetUserPasswordHttpDto } from '../dto/set-user-password.http.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUser: RegisterUserUseCase,
    private readonly loginUser: LoginUserUseCase,
    private readonly refreshSession: RefreshSessionUseCase,
    private readonly logoutUser: LogoutUserUseCase,
    private readonly changePassword: ChangePasswordUseCase,
    private readonly setUserPassword: SetUserPasswordUseCase,
  ) {}

  /**
   * Registro de usuario / socio (solo ADMIN).
   * Campos alineados con el formulario «Crear socio» del panel admin.
   */
  @Post('register')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  async register(@Body() body: RegisterUserHttpDto) {
    return this.handleRegisterUser(body);
  }

  private async handleRegisterUser(body: RegisterUserHttpDto) {
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
    } catch (err) {
      if (err instanceof EmailAlreadyTakenError) {
        throw new ConflictException(err.message);
      }
      if (err instanceof SocioCodigoAlreadyTakenError) {
        throw new ConflictException(err.message);
      }
      if (err instanceof CityNotFoundError) {
        throw new BadRequestException(err.message);
      }
      if (err instanceof RoleCodeNotFoundError) {
        throw new BadRequestException(err.message);
      }
      throw new InternalServerErrorException();
    }
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() body: LoginUserHttpDto) {
    try {
      return await this.loginUser.execute({
        usuario: body.usuario ?? body.email ?? '',
        password: body.password,
      });
    } catch (err) {
      if (err instanceof UserInactiveError) {
        throw new ForbiddenException(err.message);
      }
      if (err instanceof MaturityExpiredError) {
        throw new ForbiddenException(err.message);
      }
      if (err instanceof InvalidCredentialsError) {
        throw new UnauthorizedException(err.message);
      }
      throw new InternalServerErrorException();
    }
  }

  @Post('refresh')
  @HttpCode(200)
  async refresh(@Body() body: RefreshTokenHttpDto) {
    try {
      return await this.refreshSession.execute(body.refreshToken);
    } catch (err) {
      if (err instanceof InvalidRefreshTokenError) {
        throw new UnauthorizedException(err.message);
      }
      throw new InternalServerErrorException();
    }
  }

  @Post('logout')
  @HttpCode(200)
  async logout(@Body() body: RefreshTokenHttpDto) {
    await this.logoutUser.execute(body.refreshToken);
    return { success: true };
  }

  @Post('reset-password')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.CUSTOMER)
  @HttpCode(200)
  async resetPassword(
    @CurrentUser() caller: AuthUserPayload,
    @Body() body: ChangePasswordHttpDto,
  ) {
    if (body.idUsuario !== caller.id) {
      throw new ForbiddenException(
        'idUsuario no coincide con el usuario del token',
      );
    }
    try {
      await this.changePassword.execute({
        userId: caller.id,
        currentPassword: body.currentPassword,
        newPassword: body.newPassword,
      });
      return { success: true, message: 'Contraseña actualizada' };
    } catch (err) {
      if (err instanceof UserNotFoundError) {
        throw new NotFoundException(err.message);
      }
      if (err instanceof SameNewPasswordError) {
        throw new BadRequestException(err.message);
      }
      if (err instanceof InvalidCredentialsError) {
        throw new UnauthorizedException(err.message);
      }
      throw new InternalServerErrorException();
    }
  }

  /**
   * Asigna contraseña por `id_user` y fuerza `pending_password_reset = true`.
   * Solo administradores.
   */
  @Put('user/password')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(200)
  async setUserPasswordByAdmin(@Body() body: SetUserPasswordHttpDto) {
    try {
      await this.setUserPassword.execute({
        userId: body.idUsuario,
        newPassword: body.newPassword,
      });
      return {
        success: true,
        message: 'Contraseña actualizada; el usuario debe restablecerla en el flujo correspondiente',
      };
    } catch (err) {
      if (err instanceof UserNotFoundError) {
        throw new NotFoundException(err.message);
      }
      throw new InternalServerErrorException();
    }
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  me(@CurrentUser() user: AuthUserPayload) {
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

  @Get('admin/health')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  adminHealth(@CurrentUser() user: AuthUserPayload) {
    return { ok: true, checkedBy: user.usuario };
  }
}
