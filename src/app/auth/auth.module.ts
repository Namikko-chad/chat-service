import { Module, } from '@nestjs/common';
import { ConfigService, } from '@nestjs/config';
import { JwtModule, } from '@nestjs/jwt';

import { AuthConfig, } from './auth.config';
import { JwtAccessGuard, } from './guards/jwt-access.guard';
import { JwtAccessStrategy, } from './strategies/jwt-access.strategy';

@Module({
  imports: [JwtModule.register({})],
  providers: [ConfigService, AuthConfig, JwtAccessStrategy, JwtAccessGuard],
  exports: [JwtAccessGuard],
})
export class AuthModule {}
