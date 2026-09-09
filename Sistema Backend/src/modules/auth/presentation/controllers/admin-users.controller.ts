import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRole, type UserRoleName } from '../../domain/user-role';
import { Roles } from '../../infrastructure/auth/roles.decorator';
import { RolesGuard } from '../../infrastructure/auth/roles.guard';
import { ManageAdminUsersUseCase } from '../../application/use-cases/manage-admin-users.use-case';
import { SetUserActiveHttpDto, UpdateAdminUserHttpDto } from '../dto/update-admin-user.http.dto';

@Controller('auth/users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminUsersController {
  constructor(private readonly manageUsers: ManageAdminUsersUseCase) {}

  @Get()
  list() {
    return this.manageUsers.list();
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateAdminUserHttpDto,
  ) {
    try {
      return await this.manageUsers.update({ ...body, id, roleCode: body.roleCode as UserRoleName });
    } catch (error) {
      throw new NotFoundException(error instanceof Error ? error.message : 'Usuario no encontrado');
    }
  }

  @Patch(':id/status')
  async setActive(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: SetUserActiveHttpDto,
  ) {
    try {
      return await this.manageUsers.setActive(id, body.isActive);
    } catch {
      throw new NotFoundException('Usuario no encontrado');
    }
  }
}