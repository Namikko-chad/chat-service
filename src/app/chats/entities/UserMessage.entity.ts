import { Column, Entity, JoinColumn, ManyToOne, } from 'typeorm';

import { AbstractEntity, EnumColumn, } from '../../database';
import { MessageStatus, } from '../chats.enum';
import { Message, } from './Message.entity';
import { Room, } from './Room.entity';
import { User, } from './User.entity';

@Entity({
  schema: 'chat',
})
export class UserMessage extends AbstractEntity {

  @Column({
    type: 'uuid',
    nullable: false,
  })
    roomId!: string;

  @Column({
    type: 'uuid',
    nullable: false,
  })
    messageId!: string;

  @Column({
    type: 'uuid',
    nullable: false,
  })
    userId!: string;

  @EnumColumn({
    enum: MessageStatus,
    default: MessageStatus.New,
  })
    status!: MessageStatus;

  @ManyToOne(() => Room, room => room.id)
  @JoinColumn({ 
    name: 'roomId',
    referencedColumnName: 'id',
  })
    room: Room;

  @ManyToOne(() => Message, message => message.id)
  @JoinColumn({ 
    name: 'messageId',
    referencedColumnName: 'id',
  })
    message: Message;

  @ManyToOne(() => User, user => user.userId)
  @JoinColumn({ 
    name: 'userId',
    referencedColumnName: 'userId',
  })
    user: User;
}
