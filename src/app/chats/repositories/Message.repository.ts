import { Injectable, } from '@nestjs/common';

import { AbstractRepository, } from '../../database';
import { Message, } from '../entities/Message.entity';

@Injectable()
export class MessageRepository extends AbstractRepository<Message> {}
