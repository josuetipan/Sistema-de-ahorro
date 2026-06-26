import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required?.length) {
      return true;
    }
    const req = context.switchToHttp().getRequest<{
      user?: { roles?: string[] };
    }>();
    const user = req.user;
    if (!user?.roles?.length) {
      throw new ForbiddenException('Sin rol para este recurso');
    }
    const allowed = required.some((role) => user.roles!.includes(role));
    if (!allowed) {
      throw new ForbiddenException('No tienes permiso para esta acción');
    }
    return true;
  }
}
