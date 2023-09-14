
import { Column, Entity, JoinColumn, ManyToOne, } from 'typeorm';

import { AbstractEntity, } from '../../database';
import { Message, } from './Message.entity';
import { Room, } from './Room.entity';

@Entity({
  schema: 'chat',
})
export class File extends AbstractEntity {
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
    fileId!: string;

  @ManyToOne(() => Room, room => room.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ 
    name: 'roomId',
    referencedColumnName: 'id',
  })
    room: Room;

  @ManyToOne(() => Message, message => message.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ 
    name: 'messageId',
    referencedColumnName: 'id',
  })
    message: Message;
}
