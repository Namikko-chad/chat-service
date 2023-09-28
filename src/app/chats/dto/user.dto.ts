import { ApiProperty, } from '@nestjs/swagger';
import { IsUUID, } from 'class-validator';


export class UserIdsDto {
  @ApiProperty({})
  @IsUUID('all', { each: true, })
    userIds!: string[];
}