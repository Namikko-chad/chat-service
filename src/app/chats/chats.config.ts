import { Inject, Injectable, } from '@nestjs/common';
import { ConfigService, } from '@nestjs/config';

interface ChatConfigInterface {
  readonly debug: boolean;
}

@Injectable()
export class ChatConfig implements ChatConfigInterface {
  public readonly debug: boolean;

  constructor(@Inject(ConfigService) private readonly configService: ConfigService) {
    this.debug = this.configService.get<string>('DEBUG') === 'true';
  }
}