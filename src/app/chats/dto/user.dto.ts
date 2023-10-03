import { ApiProperty, } from '@nestjs/swagger';
import { Expose, plainToInstance, } from 'class-transformer';
import { IsUUID, } from 'class-validator';

import { AbstractDto, } from '../../dto';
import { UserModel, } from '../models/user.model';

export class UserIdsDto {
  @ApiProperty({ description: 'Unique identifier of users', format: 'uuid', })
  @IsUUID('all', { each: true, })
    userIds!: string[];
}

export class UserDto extends AbstractDto implements UserModel {
  static create(this: void, input: UserDto): UserDto {
    return plainToInstance(UserDto, input, { strategy: 'excludeAll', });
  }

  @ApiProperty({ description: 'Unique identifier of file-message', format: 'uuid', })
  @IsUUID()
  declare id: string;

  @ApiProperty({ description: 'Unique identifier of room', format: 'uuid', })
  @IsUUID()
    roomId: string;

  @ApiProperty({ description: 'Unique identifier of user', format: 'uuid', })
  @Expose()
  @IsUUID()
    userId: string;
}