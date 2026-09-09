import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from '../../../auth/domain/user-role';
import { Roles } from '../../../auth/infrastructure/auth/roles.decorator';
import { RolesGuard } from '../../../auth/infrastructure/auth/roles.guard';
import { CurrentUser, type AuthUserPayload } from '../../../auth/infrastructure/auth/current-user.decorator';
import { ListarAportesUseCase } from '../../application/use-cases/listar-aportes.use-case';
import { VerificarAporteUseCase } from '../../application/use-cases/verificar-aporte.use-case';
import { VerificarAporteHttpDto } from '../dto/verificar-aporte.http.dto';
import { GetComprobanteAporteAdminUseCase } from '../../application/use-cases/get-comprobante-aporte-admin.use-case';
import { parsePagination } from '@shared/presentation/parse-pagination';
import type { EstadoAporte } from '@prisma/client';

@Controller('contador/aportes')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.ADMIN, UserRole.ACCOUNTANT)
export class ContadorAportesController {
  constructor(
    private readonly listarAportes: ListarAportesUseCase,
    private readonly verificarAporte: VerificarAporteUseCase,
    private readonly getComprobanteAporte: GetComprobanteAporteAdminUseCase,
  ) {}

  @Get()
  list(@Query('estado') estado?: EstadoAporte, @Query('page') page?: string, @Query('limit') limit?: string) {
    const pagination = parsePagination(page, limit);
    return this.listarAportes.execute({ estado, page: pagination.page, limit: pagination.limit });
  }

  @Get(':aporteId/comprobante')
  async comprobante(@Param('aporteId', ParseUUIDPipe) aporteId: string) {
    try {
      return await this.getComprobanteAporte.execute(aporteId);
    } catch {
      throw new NotFoundException('Comprobante no encontrado');
    }
  }

  @Patch(':aporteId/estado')
  async verify(
    @CurrentUser() user: AuthUserPayload,
    @Param('aporteId', ParseUUIDPipe) aporteId: string,
    @Body() body: VerificarAporteHttpDto,
  ) {
    try {
      return await this.verificarAporte.execute({
        aporteId,
        estado: body.estado,
        observaciones: body.observaciones ?? null,
        verificadoPor: user.id,
      });
    } catch {
      throw new NotFoundException('Aporte no encontrado');
    }
  }
}