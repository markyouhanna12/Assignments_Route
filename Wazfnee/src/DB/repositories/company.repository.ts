import { Model } from 'mongoose';
import { DatabaseRepository } from '../database.repository';
import { ICompany } from '../Models/company.model';

export class CompanyRepository extends DatabaseRepository<ICompany> {
  constructor(protected override readonly model: Model<ICompany>) {
    super(model);
  }
}
