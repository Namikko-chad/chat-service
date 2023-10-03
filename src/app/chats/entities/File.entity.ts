
import { Column, Entity, JoinColumn, ManyToOne, } from 'typeorm';

import { AbstractEntity, JsonColumn, } from '../../database';
import { FileInfo, } from '../../dto';
import { FileModel, } from '../models/file.model';
import { Message, } from './Message.entity';
import { Room, } from './Room.entity';

@Entity({
  schema: 'chat',
})
export class File extends AbstractEntity implements FileModel {
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

  @JsonColumn({
    type: 'json',
    nullable: false,
  })
    meta!: FileInfo;

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
