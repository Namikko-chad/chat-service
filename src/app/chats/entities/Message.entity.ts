import { Column, Entity, JoinColumn, ManyToOne, OneToMany, } from 'typeorm';

import { AbstractEntity, } from '../../database';
import { MessageModel, } from '../models/message.model';
import { File, } from './File.entity';
import { Room, } from './Room.entity';
import { UserMessage, } from './UserMessage.entity';

@Entity({
  schema: 'chat',
})
export class Message extends AbstractEntity implements MessageModel {
  @Column({
    type: 'uuid',
    nullable: false,
  })
    userId!: string;

  @Column({
    type: 'uuid',
    nullable: false,
  })
    roomId!: string;

  @Column({
    type: 'text',
    nullable: true,
  })
    message?: string;

  @Column({
    type: 'boolean',
    default: false,
  })
    edited!: boolean;

  @ManyToOne(() => Room, room => room.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ 
    name: 'roomId',
    referencedColumnName: 'id',
  })
    room: Room;
  
  @OneToMany(() => File, file => file.messageId)
  @JoinColumn({ 
    name: 'id',
    referencedColumnName: 'messageId',
  })
    files: File[];
  
  @OneToMany(() => UserMessage, userMessage => userMessage.messageId)
  @JoinColumn({ 
    name: 'id',
    referencedColumnName: 'messageId',
  })
    userStatuses: UserMessage[];
}
