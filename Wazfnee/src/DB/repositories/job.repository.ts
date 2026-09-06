import { Model } from 'mongoose';
import { DatabaseRepository } from '../database.repository';
import { IJob } from '../Models/job.model';

export class JobRepository extends DatabaseRepository<IJob> {
  constructor(protected override readonly model: Model<IJob>) {
    super(model);
  }
}
