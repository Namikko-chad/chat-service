import { Injectable, } from '@nestjs/common';

import { AbstractRepository, } from '../../database';
import { UserMessage, } from '../entities/UserMessage.entity';

@Injectable()
export class UserMessageRepository extends AbstractRepository<UserMessage> {}
