import { DataSource, DeepPartial, Repository, } from 'typeorm';

import { AbstractEntity, } from './AbstractEntity';

export abstract class AbstractGenerator<Entity extends AbstractEntity> {
  protected readonly _repository: Repository<Entity>;
  
  constructor(_ds: DataSource) {
    this._repository = _ds.getRepository(this.constructor.name.replace('Generator', ''));
  }

  protected abstract default(): DeepPartial<Entity>

  async create(params?: DeepPartial<Entity>): Promise<Entity> {
    const entity = this.default();
    if (params)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-assignment, security/detect-object-injection
      Object.entries(params).forEach( ([key, value]) => entity[key] = value );
    entity.createdAt = Date.now();
    entity.updatedAt = Date.now();

    return this.save(entity);
  }

  async save(entity: DeepPartial<Entity>): Promise<Entity> {
    return this._repository.save(entity);
  }
}