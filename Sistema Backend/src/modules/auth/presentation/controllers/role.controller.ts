import {
  Body,
  ConflictException,
  Controller,
  Get,
  Inject,
  InternalServerErrorException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CodeRoleAlreadyTakenError } from '../../domain/code-role-already-taken.error';
import { RoleNameAlreadyTakenError } from '../../domain/role-name-already-taken.error';
import { UserRole } from '../../domain/user-role';
import { CreateRoleUseCase } from '../../application/use-cases/create-role.use-case';
import {
  ROLE_REPOSITORY,
  type RoleRepositoryPort,
} from '../../domain/ports/role.repository.port';
import { Roles } from '../../infrastructure/auth/roles.decorator';
import { RolesGuard } from '../../infrastructure/auth/roles.guard';
import { CreateRoleHttpDto } from '../dto/create-role.http.dto';

@Controller('auth/roles')
export class RoleController {
  constructor(
    private readonly createRole: CreateRoleUseCase,
    @Inject(ROLE_REPOSITORY) private readonly roles: RoleRepositoryPort,
  ) {}

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  async list() {
    const rows = await this.roles.listActive();
    return rows.map((row) => ({
      id: row.idRole,
      name: row.name,
      codeRole: row.codeRole,
      description: row.description,
    }));
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(@Body() body: CreateRoleHttpDto) {
    try {
      const row = await this.createRole.execute({
        name: body.name,
        codeRole: body.codeRole,
        description: body.description,
        isActive: body.isActive,
      });
      return {
        id: row.idRole,
        name: row.name,
        codeRole: row.codeRole,
        description: row.description,
        isActive: row.isActive,
        createdAt: row.createdAt,
      };
    } catch (err) {
      if (
        err instanceof CodeRoleAlreadyTakenError ||
        err instanceof RoleNameAlreadyTakenError
      ) {
        throw new ConflictException(err.message);
      }
      throw new InternalServerErrorException();
    }
  }
}
