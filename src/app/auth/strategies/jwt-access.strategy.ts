import { Inject, Injectable, } from '@nestjs/common';
import { PassportStrategy, } from '@nestjs/passport';
import { JwtPayload, } from 'jsonwebtoken';
import { ExtractJwt, Strategy, } from 'passport-jwt';

import { AuthConfig, } from '../auth.config';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt-access') {
  constructor(
  @Inject(AuthConfig) config: AuthConfig
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.jwt.access.secret,
    });
  }

  validate(payload: JwtPayload) {
    if (!payload) {
      return null;
    }
 
    return payload;
  }
}
