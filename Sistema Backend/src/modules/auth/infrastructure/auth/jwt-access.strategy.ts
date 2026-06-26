import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import {
  USER_REPOSITORY,
  type UserRepositoryPort,
} from '../../domain/ports/user.repository.port';
import { isMaturityExpired } from '../../domain/maturity.util';
import { getJwtAccessSecret } from './jwt-access-secret';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepositoryPort,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: getJwtAccessSecret(),
    });
  }

  async validate(payload: { sub: string }) {
    const user = await this.users.findById(payload.sub);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Usuario no encontrado o inactivo');
    }
    if (isMaturityExpired(user.maturityAt)) {
      throw new UnauthorizedException('Cuenta vencida');
    }
    return {
      id: user.id,
      usuario: user.usuario,
      email: user.email,
      fullName: user.fullName,
      cityId: user.cityId,
      cityName: user.cityName,
      roles: [...user.roles],
    };
  }
}
