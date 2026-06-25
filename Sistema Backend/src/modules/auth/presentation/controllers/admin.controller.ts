import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { EmailAlreadyTakenError } from '../../domain/email-already-taken.error';
import { RoleCodeNotFoundError } from '../../domain/role-code-not-found.error';
import { CreateAdminUserUseCase } from '../../application/use-cases/create-admin-user.use-case';
import { CreateAdminUserHttpDto } from '../dto/create-admin-user.http.dto';

/**
 * Creación pública de administrador: inserta `users` (rol ADMIN) + `admins`.
 * Respuesta solo mensaje + datos para login (sin tokens; usar POST /auth/login).
 */
@Controller('auth/admins')
export class AdminController {
  constructor(private readonly createAdminUser: CreateAdminUserUseCase) {}

  @Post()
  @HttpCode(201)
  async create(@Body() body: CreateAdminUserHttpDto) {
    try {
      return await this.createAdminUser.execute({
        email: body.email,
        password: body.password,
        fullName: body.fullName,
        phoneNumber: body.phoneNumber,
        identification: body.identification,
      });
    } catch (err) {
      if (err instanceof EmailAlreadyTakenError) {
        throw new ConflictException(err.message);
      }
      if (err instanceof RoleCodeNotFoundError) {
        throw new BadRequestException(
          'No existe el rol ADMIN en la base de datos. Ejecuta el seed de roles.',
        );
      }
      throw new InternalServerErrorException();
    }
  }
}
