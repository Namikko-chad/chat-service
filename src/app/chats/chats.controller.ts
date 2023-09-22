
import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Req, UseGuards, } from '@nestjs/common';
import { ApiTags, } from '@nestjs/swagger';

import { JwtAccessGuard, } from '../auth';
import { ListDto, RequestAuth, } from '../dto';
import { ChatService, } from './chats.service';
import { RoomCreateDto, RoomIdDto, RoomUpdateDto, } from './dto/room.dto';
import { Room, } from './entities/Room.entity';

@ApiTags('chat')
@Controller('chat')
@UseGuards(JwtAccessGuard)
export class ChatController {
  constructor(
    @Inject(ChatService) private readonly _chatService: ChatService
  ) {

  }

  @Get()
  async list(@Req() req: RequestAuth, listParam: ListDto<Room>): Promise<{ count: number; rows: Room[] }> {
    const [rows, count] = await this._chatService.getRoomList(req.user.userId, listParam);

    return {
      count,
      rows,
    };
  }

  @Post()
  async createRoom(@Req() req: RequestAuth, @Body() payload: RoomCreateDto): Promise<Room> {
    const room = await this._chatService.createRoom(req.user.userId, payload);

    return room;
  }

  @Get(':roomId')
  async retrieveRoom(@Req() req: RequestAuth, @Param() param: RoomIdDto): Promise<Room> {
    const room = await this._chatService.getRoom(req.user.userId, param.roomId);

    return room;
  }

  @Put(':roomId')
  async updateRoom(@Req() req: RequestAuth, @Param() param: RoomIdDto, @Body() payload: RoomUpdateDto): Promise<Room> {
    const room = await this._chatService.updateRoom(req.user.userId, param.roomId, payload);

    return room;
  }

  @Delete(':roomId')
  async deleteRoom(@Req() req: RequestAuth, @Param() param: RoomIdDto): Promise<void> {
    return this._chatService.deleteRoom(req.user.userId, param.roomId);
  }
}
