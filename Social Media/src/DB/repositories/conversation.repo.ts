import { Model } from 'mongoose';
import { DatabaseRepository } from '../database.repository';
import { IConversation } from '../Models/conversation.model';

export class ConversationRepository extends DatabaseRepository<IConversation> {
  constructor(protected override readonly model: Model<IConversation>) {
    super(model);
  }
}
