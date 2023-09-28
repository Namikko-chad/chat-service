
import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query, Req, UseGuards, UsePipes, ValidationPipe, } from '@nestjs/common';
import { ApiTags, } from '@nestjs/swagger';

import { JwtAccessGuard, } from '../auth';
import { ListDto, RequestAuth, } from '../dto';
import { ChatService, } from './chats.service';
import { MessageCreateDto, MessageDeleteDto, MessageDeliverDto, MessageEditDto, MessageIdDto, MessageReadDto, } from './dto/message.dto';
import { RoomCreateDto, RoomIdDto, RoomUpdateDto, } from './dto/room.dto';
import { UserIdsDto, } from './dto/user.dto';
import { Message, } from './entities/Message.entity';
import { Room, } from './entities/Room.entity';

@ApiTags('chat')
@Controller('chat')
@UseGuards(JwtAccessGuard)
@UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true, }))
export class ChatHttpController {
  @Inject(ChatService) private readonly _chatService: ChatService;

  /**
   * Room part
   */

  @Get()
  async list(@Req() req: RequestAuth, @Query() listParam: ListDto<Room>): Promise<{ count: number; rows: Room[] }> {
    const [rows, count] = await this._chatService.roomList({
      userId: req.user.userId,
      listParam,
    });

    return {
      count,
      rows,
    };
  }

  @Post()
  async createRoom(@Req() req: RequestAuth, @Body() payload: RoomCreateDto): Promise<Room> {
    const room = await this._chatService.roomCreate({
      ...payload,
      userId: req.user.userId,
    });

    return room;
  }

  @Get(':roomId')
  async retrieveRoom(@Req() req: RequestAuth, @Param() param: RoomIdDto): Promise<Room> {
    const room = await this._chatService.roomRetrieve({
      userId: req.user.userId,
      roomId: param.roomId,
    });

    return room;
  }

  @Put(':roomId')
  async updateRoom(@Req() req: RequestAuth, @Param() param: RoomIdDto, @Body() payload: RoomUpdateDto): Promise<Room> {
    const room = await this._chatService.roomUpdate({
      ...payload,
      userId: req.user.userId,
      roomId: param.roomId,
    });

    return room;
  }

  @Delete(':roomId')
  async deleteRoom(@Req() req: RequestAuth, @Param() param: RoomIdDto): Promise<void> {
    return this._chatService.roomDelete({
      userId: req.user.userId,
      roomId: param.roomId,
    });
  }

  /**
   * Message part
   */

  @Get(':roomId/message')
  async retrieveMessage(@Req() req: RequestAuth, @Param() param: RoomIdDto, @Query() listParam: ListDto<Message>): 
  Promise<{ count: number; rows: Message[] }> {
    const [rows, count] = await this._chatService.messageRetrieve({
      userId: req.user.userId,
      roomId: param.roomId,
      listParam,
    });

    return {
      count,
      rows,
    };
  }

  @Post(':roomId/message')
  async createMessage(@Req() req: RequestAuth, @Param() param: RoomIdDto, @Body() payload: MessageCreateDto): Promise<Message> {
    const message = await this._chatService.messageCreate({
      ...payload,
      userId: req.user.userId,
      roomId: param.roomId,
    });

    return message;
  }

  @Delete(':roomId/message')
  async deleteMessage(@Req() req: RequestAuth, @Param() param: RoomIdDto, @Body() payload: MessageDeleteDto): Promise<void> {
    return this._chatService.messageDelete({
      ...payload,
      userId: req.user.userId,
      roomId: param.roomId,
    });
  }

  @Put(':roomId/message/deliver')
  async deliverMessage(@Req() req: RequestAuth, @Param() param: RoomIdDto, @Body() payload: MessageDeliverDto): Promise<void> {
    return this._chatService.messageDeliver({
      ...payload,
      userId: req.user.userId,
      roomId: param.roomId,
    });
  }

  @Put(':roomId/message/read')
  async readMessage(@Req() req: RequestAuth, @Param() param: RoomIdDto, @Body() payload: MessageReadDto): Promise<void> {
    return this._chatService.messageRead({
      ...payload,
      userId: req.user.userId,
      roomId: param.roomId,
    });
  }

  @Put(':roomId/message/:messageId')
  async editMessage(@Req() req: RequestAuth, @Param() param: MessageIdDto, @Body() payload: MessageEditDto): Promise<Message> {
    const message = await this._chatService.messageEdit({
      ...payload,
      userId: req.user.userId,
      roomId: param.roomId,
      messageId: param.messageId,
    });

    return message;
  }

  /**
   * User part
   */

  @Post(':roomId/user')
  async userAdd(@Req() req: RequestAuth, @Param() param: RoomIdDto, @Body() payload: UserIdsDto): Promise<void> {
    return this._chatService.userAdd({
      ...payload,
      userId: req.user.userId,
      roomId: param.roomId,
    });
  }

  @Delete(':roomId/user')
  async userRemove(@Req() req: RequestAuth, @Param() param: RoomIdDto, @Body() payload: UserIdsDto): Promise<void> {
    return this._chatService.userRemove({
      ...payload,
      userId: req.user.userId,
      roomId: param.roomId,
    });
  }
}
