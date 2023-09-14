import { ApiProperty, } from '@nestjs/swagger';
import { IsUUID, } from 'class-validator';

export class RoomIdDto {
  @ApiProperty({})
  @IsUUID()
    roomId!: string;
}