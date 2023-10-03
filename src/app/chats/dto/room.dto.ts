import { ApiProperty, IntersectionType, PartialType, PickType, } from '@nestjs/swagger';
import { Expose, plainToInstance,Type,  } from 'class-transformer';
import { IsNumber, IsOptional, IsString, IsUUID, } from 'class-validator';

import { AbstractDto, } from '../../dto';
import { RoomModel, } from '../models/room.model';
import { FileDto, } from './file.dto';
import { MessageDto, } from './message.dto';
import { UserDto, UserIdsDto, } from './user.dto';

export class RoomIdDto {
  @ApiProperty({ description: 'Unique identifier of room', format: 'uuid', })
  @IsUUID()
    roomId!: string;
}

export class RoomDto extends AbstractDto implements RoomModel {
  static create(this: void, input: RoomDto): RoomDto {
    return plainToInstance(RoomDto, input, { strategy: 'excludeAll', });
  }

  @ApiProperty({ description: 'Unique identifier of room', format: 'uuid', })
  @Expose()
  @IsUUID()
  declare id: string;
  
  @ApiProperty({ description: 'Name of room', nullable: true, format: 'string', })
  @Expose()
  @IsOptional()
  @IsString()
    name?: string;

  @ApiProperty({ description: 'Icon for room', format: 'uuid', })
  @Expose()
  @IsOptional()
  @IsUUID()
    iconId?: string;

  @ApiProperty({ description: 'Array of messages', format: 'array', })
  @Expose()
  @Type(() => MessageDto)
  @IsOptional()
    messages: MessageDto[];

  @ApiProperty({ description: 'Array of users', format: 'array', })
  @Expose()
  @Type(() => UserDto)
  @IsOptional()
    users: UserDto[];

  @ApiProperty({ description: 'Array of files', format: 'array', })
  @Expose()
  @Type(() => FileDto)
  @IsOptional()
    files: FileDto[];

  @ApiProperty({ description: 'Number of users in room', format: 'number', })
  @Expose()
  @IsOptional()
  @IsNumber()
    usersCount: number;

  @ApiProperty({ description: 'Number of messages in room', format: 'number', })
  @Expose()
  @IsOptional()
  @IsNumber()
    messagesCount: number;

  @ApiProperty({ description: 'Number of unread messages in room', format: 'number', })
  @Expose()
  @IsOptional()
  @IsNumber()
    unreadMessagesCount: number;
}

export class RoomCreateDto extends IntersectionType(PartialType(UserIdsDto), PickType(RoomDto, ['name', 'iconId'])) {
  static create(this: void, input: RoomCreateDto): RoomCreateDto {
    return plainToInstance(RoomCreateDto, input, { strategy: 'excludeAll', });
  }
}

export class RoomUpdateDto extends PickType(RoomDto, ['name', 'iconId']) {
  static create(this: void, input: RoomUpdateDto): RoomUpdateDto {
    return plainToInstance(RoomUpdateDto, input, { strategy: 'excludeAll', });
  }
}