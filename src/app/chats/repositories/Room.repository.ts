import { Injectable, } from '@nestjs/common';

import { AbstractRepository, } from '../../database';
import { Room, } from '../entities/Room.entity';

@Injectable()
export class RoomRepository extends AbstractRepository<Room> {}
