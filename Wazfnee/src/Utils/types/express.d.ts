import { IUserDocument } from '../../DB/Models/user.model';
import { CustomJwtPayload } from '../services/token.service';

declare global {
  namespace Express {
    interface Request {
      user: IUserDocument;
      decoded: CustomJwtPayload;
    }
  }
}

export {};
