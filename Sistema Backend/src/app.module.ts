import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from '@modules/health/health.module';
import { AuthModule } from '@modules/auth/auth.module';
import { AhorroModule } from '@modules/ahorro/ahorro.module';
import { PrismaModule } from '@shared/infrastructure/prisma/prisma.module';
import { RedisCacheModule } from '@shared/infrastructure/cache/redis-cache.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RedisCacheModule,
    PrismaModule,
    HealthModule,
    AuthModule,
    AhorroModule,
  ],
})
export class AppModule {}
