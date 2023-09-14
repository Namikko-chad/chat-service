import { Injectable, } from '@nestjs/common';

import { AbstractRepository, } from '../../database';
import { User, } from '../entities/User.entity';

@Injectable()
export class UserRepository extends AbstractRepository<User> {}
