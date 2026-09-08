import { Model } from 'mongoose';
import { DatabaseRepository } from '../database.repository';
import { IApplication } from '../Models/application.model';
import { INotification } from '../Models/notification.model';

export class NotificationRepository extends DatabaseRepository<INotification> {
  constructor(protected override readonly model: Model<INotification>) {
    super(model);
  }
}
