import { ApiProperty, PickType, } from '@nestjs/swagger';
import { Expose, plainToInstance,Type,  } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, IsUUID, } from 'class-validator';

import { AbstractDto, } from '../../dto';
import { MessageModel, } from '../models/message.model';
import { FileDto, } from './file.dto';
import { RoomIdDto, } from './room.dto';
import { UserMessageDto, } from './user-message.model';

export class MessageIdDto extends PickType(RoomIdDto, ['roomId']) {

  @ApiProperty({ description: 'Unique identifier of message', format: 'uuid', })
  @IsUUID()
    messageId!: string;
}

export class MessageDto extends AbstractDto implements MessageModel {
  static create(this: void, input: MessageDto): MessageDto {
    return plainToInstance(MessageDto, input, { strategy: 'excludeAll', });
  }

  @ApiProperty({ description: 'Unique identifier of message', format: 'uuid', })
  @Expose()
  @IsUUID()
  declare id: string;

  @ApiProperty({ description: 'Unique identifier of room', format: 'uuid', })
  @IsUUID()
    roomId!: string;

  @ApiProperty({ description: 'Unique identifier of user', format: 'uuid', })
  @Expose()
  @IsUUID()
    userId!: string;

  @ApiProperty({ description: 'Message', format: 'string', })
  @Expose()
  @IsOptional()
  @IsString()
    message?: string;

  @ApiProperty({ description: 'Edited message', format: 'boolean', })
  @Expose()
  @IsBoolean()
    edited: boolean;

  @ApiProperty({ description: 'Files of message', format: 'array', })
  @Expose()
  @Type(() => FileDto)
  @IsOptional()
    files?: FileDto[];

  @ApiProperty({ description: 'Users status for message', format: 'object', })
  @Expose()
  @Type(() => UserMessageDto)
  @IsOptional()
    userStatuses?: UserMessageDto[];
}

class MessageIdsDto {
  @ApiProperty({ description: 'Unique identifier of messages', format: 'uuid', })
  @IsUUID('all', { each: true, })
    messageIds: string[];
}

export class MessageCreateDto extends PickType(MessageDto, ['message', 'files']) {
}

export class MessageEditDto extends PickType(MessageDto, ['message', 'files']) {
}

export class MessageDeliverDto extends MessageIdsDto {
}

export class MessageReadDto extends MessageIdsDto {
}

export class MessageDeleteDto extends MessageIdsDto {
  @ApiProperty({ description: 'Remove message for all users', })
  @IsOptional()
  @IsBoolean()
    forAll = false;
}