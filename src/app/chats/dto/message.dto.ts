import { ApiProperty, } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, IsUUID, } from 'class-validator';

import { FileInfo, } from '../../dto';

export class MessageIdDto {
  @ApiProperty({})
  @IsUUID()
    roomId!: string;

  @ApiProperty({})
  @IsUUID()
    messageId!: string;
}

export class MessageCreateDto {
  @ApiProperty({})
  @IsOptional()
  @IsString()
    message?: string;

  @ApiProperty({})
  @IsOptional()
  @IsUUID('all', { each: true, })
    files?: FileInfo[];
}

export class MessageEditDto {
  @ApiProperty({})
  @IsOptional()
  @IsString()
    message?: string;

  @ApiProperty({})
  @IsOptional()
    files?: FileInfo[];
}

export class MessageDeleteDto {
  @ApiProperty({})
  @IsUUID('all', { each: true, })
    messageIds: string[];

  @ApiProperty({})
  @IsBoolean()
    forAll = false;
}

export class MessageDeliverDto {
  @ApiProperty({})
  @IsUUID('all', { each: true, })
    messageIds: string[];
}

export class MessageReadDto {
  @ApiProperty({})
  @IsUUID('all', { each: true, })
    messageIds: string[];
}