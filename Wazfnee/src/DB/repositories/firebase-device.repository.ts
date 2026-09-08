import { Model } from 'mongoose';
import { DatabaseRepository } from '../database.repository';
import { IFirebaseDevice } from '../Models/firebase-device.model';

export class FirebaseDeviceRepository extends DatabaseRepository<IFirebaseDevice> {
  constructor(protected override readonly model: Model<IFirebaseDevice>) {
    super(model);
  }
}
