import { ApiProperty, } from '@nestjs/swagger';
import { Expose, plainToInstance, } from 'class-transformer';
import { IsEnum, IsUUID, } from 'class-validator';

import { AbstractDto, } from '../../dto';
import { MessageStatus, } from '../chats.enum';
import { UserModel, } from '../models/user.model';


export class UserMessageDto extends AbstractDto implements UserModel {
  static create(this: void, input: UserMessageDto): UserMessageDto {
    return plainToInstance(UserMessageDto, input, { strategy: 'excludeAll', });
  }

  @ApiProperty({ description: 'Unique identifier of user-message', format: 'uuid', })
  @IsUUID()
  declare id: string;

  @ApiProperty({ description: 'Unique identifier of room', format: 'uuid', })
  @IsUUID()
    roomId: string;

  @ApiProperty({ description: 'Unique identifier of user', format: 'uuid', })
  @Expose()
  @IsUUID()
    userId: string;

  @ApiProperty({ description: 'Unique identifier of message', format: 'uuid', })
  @IsUUID()
    messageId: string;

  @ApiProperty({ description: 'Status', format: 'enum', enum: MessageStatus, enumName: 'MessageStatus', })
  @Expose()
  @IsEnum(MessageStatus)
    status: MessageStatus;
}