import { Injectable, } from '@nestjs/common';
import { ConfigService, } from '@nestjs/config';

import { Token, } from './auth.dto';

interface JwtTokenInterface {
  secret: string;
}

export interface JwtAuthInterface {
  [Token.Access]: JwtTokenInterface;
}

@Injectable()
export class AuthConfig {
  /** JWT auth secrets */
  public jwt: JwtAuthInterface;

  constructor(private readonly configService: ConfigService) {
    this.jwt = {
      [Token.Access]: {
        secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
      },
    };
  }
}
