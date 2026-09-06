import { Model } from 'mongoose';
import { DatabaseRepository } from '../database.repository';
import { IApplication } from '../Models/application.model';

export class ApplicationRepository extends DatabaseRepository<IApplication> {
  constructor(protected override readonly model: Model<IApplication>) {
    super(model);
  }
}
