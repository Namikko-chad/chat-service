import { Injectable, } from '@nestjs/common';
import { ConfigService, } from '@nestjs/config';

import { Token, } from './auth.enum';

interface JwtTokenInterface {
  secret: string;
}

type JwtAuthInterface = Record<Token, JwtTokenInterface>

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
