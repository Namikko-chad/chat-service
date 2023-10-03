import { Inject, Injectable, } from '@nestjs/common';
import { DataSource, Repository, } from 'typeorm';

import { User, } from '../entities/User.entity';

@Injectable()
export class UserProcessor {
  private readonly _repository: Repository<User>;

  constructor(@Inject(DataSource) private readonly ds: DataSource) {
    this._repository = this.ds.getRepository(User);
  };

  async list(roomId: string, take = 10): Promise<User[]> {
    return this._repository.find({
      where: {
        roomId,
      },
      take,
    });
  }

  async add(roomId: string, userIds: string[]): Promise<void> {
    await this.ds.createQueryBuilder().insert().into(User).values(userIds.map(
      userId => {
        return this._repository.create({
          roomId,
          userId,
        });
      }
    )).execute();
  }

  async remove(roomId: string, userIds: string[]): Promise<void> {
    await this.ds.createQueryBuilder().delete().from(User).where(userIds.map(
      userId => {
        return {
          roomId,
          userId,
        };
      }
    )).execute();
  }

}