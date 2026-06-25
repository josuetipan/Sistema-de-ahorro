import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface AuthUserPayload {
  id: string;
  usuario: string;
  email: string | null;
  fullName: string;
  cityId: string;
  cityName: string;
  roles: string[];
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthUserPayload => {
    const request = ctx.switchToHttp().getRequest<{ user: AuthUserPayload }>();
    return request.user;
  },
);
