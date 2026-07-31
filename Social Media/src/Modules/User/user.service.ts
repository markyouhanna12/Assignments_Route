import { Request, Response } from 'express';
import { UserModel } from '../../DB/Models/user.model';
import { UserRepository } from '../../DB/repositories/user.repo';
import { decrypt } from '../../Utils/security/encryption';
import { successResponse } from '../../Utils/response/success.response';

class UserService {
  private _userRepo = new UserRepository(UserModel);

  constructor() {}

  getProfile = async (req: Request, res: Response): Promise<Response> => {
    const userProfile = req.user;

    userProfile.phone = await decrypt(userProfile.phone);

    return successResponse({
      res,
      message: 'Done',
      statusCode: 200,
      data: userProfile,
    });
  };
}

export default new UserService();
