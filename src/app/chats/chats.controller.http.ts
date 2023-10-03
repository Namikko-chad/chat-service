
import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query, Req, UseGuards, UsePipes, ValidationPipe, } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags, } from '@nestjs/swagger';

import { JwtAccessGuard, } from '../auth';
import { ListDto, RequestAuth,  } from '../dto';
import { ChatService, } from './chats.service';
import { MessageCreateDto, MessageDeleteDto, MessageDeliverDto, MessageDto, MessageEditDto, MessageIdDto, MessageReadDto, } from './dto/message.dto';
import { RoomCreateDto, RoomDto, RoomIdDto, RoomUpdateDto, } from './dto/room.dto';
import { UserIdsDto, } from './dto/user.dto';
import { Room, } from './entities/Room.entity';

@Controller('chat')
@UseGuards(JwtAccessGuard)
@UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true, }))
@ApiTags('chat')
@ApiBearerAuth()
export class ChatHttpController {
  @Inject(ChatService) private readonly _chatService: ChatService;

  /**
   * Room part
   */

  @Get()
  @ApiTags('room')
  @ApiOperation({ summary: 'List of rooms', })
  @ApiOkResponse({ 
    type: () => RoomDto,
    description: 'Array of rooms',
  })
  /**
   * Retrieves a list of rooms based on the provided parameters.
   *
   * @param {RequestAuth} req - The request object containing the user authentication information.
   * @param {ListDto<Room>} listParam - The parameters for listing the rooms.
   * @returns {Promise<{ count: number; rows: Room[] }>} - A promise that resolves to an object 
   * containing the count of rooms and an array of room objects.
   */
  async roomList(@Req() req: RequestAuth, @Query() listParam: ListDto<Room>): Promise<{ count: number; rows: RoomDto[] }> {
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
  @ApiTags('room')
  @ApiOperation({ summary: 'Create room', })
  @ApiCreatedResponse({ 
    type: () => RoomDto,
    description: 'Room',
  })
  /**
   * Creates a new room.
   *
   * @param {@Req() req: RequestAuth} req - The authenticated request object.
   * @param {@Body() payload: RoomCreateDto} payload - The data for creating the room.
   * @return {Promise<Room>} The newly created room.
   */
  async roomCreate(@Req() req: RequestAuth, @Body() payload: RoomCreateDto): Promise<RoomDto> {
    const room = await this._chatService.roomCreate({
      ...payload,
      userId: req.user.userId,
    });

    return room;
  }

  @Get(':roomId')
  @ApiTags('room')
  @ApiOperation({ summary: 'Retrieve room', })
  @ApiOkResponse({ 
    type: () => RoomDto,
    description: 'Room',
  })
  /**
   * Retrieves a room based on the provided request and parameter.
   *
   * @param {@Req()} req - The request object containing authentication information.
   * @param {@Param()} param - The parameter object containing the room ID.
   * @return {Promise<Room>} The retrieved room.
   */
  async roomRetrieve(@Req() req: RequestAuth, @Param() param: RoomIdDto): Promise<RoomDto> {
    const room = await this._chatService.roomRetrieve({
      userId: req.user.userId,
      roomId: param.roomId,
    });

    return room;
  }

  @Put(':roomId')
  @ApiTags('room')
  @ApiOperation({ summary: 'Update room', })
  /**
   * Updates a room.
   *
   * @param {RequestAuth} req - the authenticated request object
   * @param {RoomIdDto} param - the room ID parameter
   * @param {RoomUpdateDto} payload - the room update payload
   * @return {Promise<Room>} the updated room
   */
  async roomUpdate(@Req() req: RequestAuth, @Param() param: RoomIdDto, @Body() payload: RoomUpdateDto): Promise<RoomDto> {
    const room = await this._chatService.roomUpdate({
      ...payload,
      userId: req.user.userId,
      roomId: param.roomId,
    });

    return room;
  }

  @Delete(':roomId')
  @ApiTags('room')
  @ApiOperation({ summary: 'Delete room', })
  /**
   * Deletes a room.
   *
   * @param {@Req() req} - The authenticated request object.
   * @param {@Param() param} - The room ID to delete.
   * @return {Promise<void>} - A promise that resolves when the room is deleted.
   */
  async roomDelete(@Req() req: RequestAuth, @Param() param: RoomIdDto): Promise<void> {
    return this._chatService.roomDelete({
      userId: req.user.userId,
      roomId: param.roomId,
    });
  }

  /**
   * Message part
   */

  @Get(':roomId/message')
  @ApiTags('message')
  @ApiOperation({ summary: 'Retrieve messages', })
  /**
   * Retrieves messages based on the provided parameters.
   *
   * @param {RequestAuth} req - The request object containing user authentication information.
   * @param {RoomIdDto} param - The parameters related to the room ID.
   * @param {ListDto<Message>} listParam - The parameters related to message listing.
   * @return {Promise<{ count: number; rows: Message[] }>} - The count and rows of the retrieved messages.
   */
  async messageRetrieve(@Req() req: RequestAuth, @Param() param: RoomIdDto, @Query() listParam: ListDto<MessageDto>): 
  Promise<{ count: number; rows: MessageDto[] }> {
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
  @ApiTags('message')
  @ApiOperation({ summary: 'Create message', })
  /**
   * Create a new message.
   *
   * @param {RequestAuth} req - the request object containing user authentication information
   * @param {RoomIdDto} param - the parameters for the room ID
   * @param {MessageCreateDto} payload - the payload for creating a new message
   * @return {Promise<Message>} - a promise that resolves to the created message
   */
  async messageCreate(@Req() req: RequestAuth, @Param() param: RoomIdDto, @Body() payload: MessageCreateDto): Promise<MessageDto> {
    const message = await this._chatService.messageCreate({
      ...payload,
      userId: req.user.userId,
      roomId: param.roomId,
      files: payload.files?.map( file => file.meta ),
    });

    return message;
  }

  @Delete(':roomId/message')
  @ApiTags('message')
  @ApiOperation({ summary: 'Delete message', })
  /**
   * Deletes a message.
   *
   * @param {RequestAuth} req - The request object containing authentication information.
   * @param {RoomIdDto} param - The object containing the room ID.
   * @param {MessageDeleteDto} payload - The object containing the message to delete.
   * @return {Promise<void>} A promise that resolves when the message is successfully deleted.
   */
  async messageDelete(@Req() req: RequestAuth, @Param() param: RoomIdDto, @Body() payload: MessageDeleteDto): Promise<void> {
    return this._chatService.messageDelete({
      ...payload,
      userId: req.user.userId,
      roomId: param.roomId,
    });
  }

  @Put(':roomId/message/deliver')
  @ApiTags('message')
  @ApiOperation({ summary: 'Deliver message', })
  /**
   * Asynchronously delivers a message.
   *
   * @param {@Req() req: RequestAuth} req - the request object containing authentication information
   * @param {@Param() param: RoomIdDto} param - the parameter object containing the room ID
   * @param {@Body() payload: MessageDeliverDto} payload - the payload object containing the message to be delivered
   * @return {Promise<void>} a promise that resolves when the message is delivered
   */
  async messageDeliver(@Req() req: RequestAuth, @Param() param: RoomIdDto, @Body() payload: MessageDeliverDto): Promise<void> {
    return this._chatService.messageDeliver({
      ...payload,
      userId: req.user.userId,
      roomId: param.roomId,
    });
  }

  @Put(':roomId/message/read')
  @ApiTags('message')
  @ApiOperation({ summary: 'Read message', })
  /**
   * Handles the message read event.
   *
   * @param {@Req()} req - The request object.
   * @param {@Param()} param - The parameter object.
   * @param {@Body()} payload - The payload object.
   * @return {Promise<void>} - A promise that resolves to void.
   */
  async messageRead(@Req() req: RequestAuth, @Param() param: RoomIdDto, @Body() payload: MessageReadDto): Promise<void> {
    return this._chatService.messageRead({
      ...payload,
      userId: req.user.userId,
      roomId: param.roomId,
    });
  }

  @Put(':roomId/message/:messageId')
  @ApiTags('message')
  @ApiOperation({ summary: 'Edit message', })
  /**
   * Edits a message.
   *
   * @param {RequestAuth} req - The request object containing user authentication information.
   * @param {MessageIdDto} param - The parameter object containing the message ID.
   * @param {MessageEditDto} payload - The payload object containing the edited message data.
   * @return {Promise<Message>} The updated message.
   */
  async messageEdit(@Req() req: RequestAuth, @Param() param: MessageIdDto, @Body() payload: MessageEditDto): Promise<MessageDto> {
    const message = await this._chatService.messageEdit({
      ...payload,
      userId: req.user.userId,
      roomId: param.roomId,
      messageId: param.messageId,
      files: payload.files.map( file => file.meta ),
    });

    return message;
  }

  /**
   * User part
   */

  @Post(':roomId/user')
  @ApiTags('user')
  @ApiOperation({ summary: 'Add user', })
  /**
   * Adds a user to a chat room.
   *
   * @param {RequestAuth} req - The request object containing user authentication information.
   * @param {RoomIdDto} param - The parameter object containing the room ID.
   * @param {UserIdsDto} payload - The payload object containing the user IDs.
   * @return {Promise<void>} A promise that resolves when the user has been added to the room.
   */
  async userAdd(@Req() req: RequestAuth, @Param() param: RoomIdDto, @Body() payload: UserIdsDto): Promise<void> {
    return this._chatService.userAdd({
      ...payload,
      userId: req.user.userId,
      roomId: param.roomId,
    });
  }

  @Delete(':roomId/user')
  @ApiTags('user')
  @ApiOperation({ summary: 'Remove user', })
  /**
   * Removes a user from a room.
   *
   * @param {@Req()} req - The authenticated request object.
   * @param {@Param()} param - The room ID to remove the user from.
   * @param {@Body()} payload - The IDs of the users to be removed.
   * @return {Promise<void>} A promise that resolves with no value.
   */
  async userRemove(@Req() req: RequestAuth, @Param() param: RoomIdDto, @Body() payload: UserIdsDto): Promise<void> {
    return this._chatService.userRemove({
      ...payload,
      userId: req.user.userId,
      roomId: param.roomId,
    });
  }
}
