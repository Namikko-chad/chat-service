import { Inject, Injectable, } from '@nestjs/common';
import { DataSource, DeepPartial, In, Repository, } from 'typeorm';

import { File, } from '../entities/File.entity';

@Injectable()
export class FileProcessor {
  private readonly _repository: Repository<File>;
  
  constructor(@Inject(DataSource) private readonly ds: DataSource) {
    this._repository = this.ds.getRepository(File);
  };

  async listByRoom(roomId: string, take = 10): Promise<File[]> {
    return this._repository.find({
      where: {
        roomId,
      },
      take,
    });
  }

  async listByMessage(messageId: string, take = 10): Promise<File[]> {
    return this._repository.find({
      where: {
        messageId,
      },
      take,
    });
  }

  async create(property: DeepPartial<File>[]): Promise<File[]> {
    const file = this._repository.create(property);

    return this._repository.save(file);
  }

  async delete(roomId: string, messageId: string, fileIds: string[]): Promise<void> {
    await this._repository.delete({
      roomId,
      messageId,
      fileId: In(fileIds),
    });
  }
}