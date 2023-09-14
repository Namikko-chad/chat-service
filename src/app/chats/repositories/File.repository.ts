import { Injectable, } from '@nestjs/common';

import { AbstractRepository, } from '../../database';
import { File, } from '../entities/File.entity';

@Injectable()
export class FileRepository extends AbstractRepository<File> {}
