import { ApiProperty, } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, } from 'class-validator';

export class RoomIdDto {
  @ApiProperty({})
  @IsUUID()
    roomId!: string;
}

export class RoomCreateDto {
  @ApiProperty({})
  @IsString()
    name?: string;

  @ApiProperty({})
  @IsOptional()
  @IsUUID()
    iconId?: string;

  @ApiProperty({})
  @IsOptional()
  @IsUUID('all', { each: true, })
    userIds?: string;
}

export class RoomUpdateDto {
  @ApiProperty({})
  @IsOptional()
  @IsString()
    name?: string;

  @ApiProperty({})
  @IsOptional()
  @IsUUID()
    iconId?: string;
}