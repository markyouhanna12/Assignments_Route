import { Model } from 'mongoose';
import { DatabaseRepository } from '../database.repository';
import { IMessage } from '../Models/message.model';

export class MessageRepository extends DatabaseRepository<IMessage> {
  constructor(protected override readonly model: Model<IMessage>) {
    super(model);
  }
}
