import { Column, Entity, JoinColumn, OneToMany, } from 'typeorm';

import { AbstractEntity, } from '../../database';
import { Utils, } from '../../utils';
import { RoomModel, } from '../models/room.model';
import { File, } from './File.entity';
import { Message, } from './Message.entity';
import { User, } from './User.entity';

@Entity({
  schema: 'chat',
})
export class Room extends AbstractEntity implements RoomModel {

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
    name = Utils.getUUID();

  @Column({
    type: 'uuid',
    nullable: true,
  })
    iconId?: string;

  @OneToMany(() => Message, message => message.roomId)
  @JoinColumn({ 
    name: 'id',
    referencedColumnName: 'roomId',
  })
    messages: Message[];

  @OneToMany(() => User, user => user.roomId)
  @JoinColumn({ 
    name: 'id',
    referencedColumnName: 'roomId',
  })
    users: User[];

  @OneToMany(() => File, file => file.roomId)
  @JoinColumn({ 
    name: 'id',
    referencedColumnName: 'roomId',
  })
    files: File[];
}