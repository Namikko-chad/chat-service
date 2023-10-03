import { ApiProperty, } from '@nestjs/swagger';
import { Expose, plainToInstance, } from 'class-transformer';
import { IsUUID, } from 'class-validator';

import { AbstractDto, FileInfo, } from '../../dto';
import { FileModel, } from '../models/file.model';

export class FileDto extends AbstractDto implements FileModel {
  static create(this: void, input: FileDto): FileDto {
    return plainToInstance(FileDto, input, { strategy: 'excludeAll', });
  }

  @ApiProperty({ description: 'Unique identifier of file-message', format: 'uuid', })
  @IsUUID()
  declare id: string;

  @ApiProperty({ description: 'Unique identifier of room', format: 'uuid', })
  @Expose()
  @IsUUID()
    roomId: string;

  @ApiProperty({ description: 'Unique identifier of message', format: 'uuid', })
  @Expose()
  @IsUUID()
    messageId: string;

  @ApiProperty({ description: 'Unique identifier of file', format: 'uuid', })
  @Expose()
  @IsUUID()
    fileId: string;

  @ApiProperty({ description: 'Metadata of file', format: 'object', })
  @Expose()
    meta: FileInfo;
}