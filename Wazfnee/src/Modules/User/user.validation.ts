import { GetUserProfileDTO, UpdateAccountDTO } from './user.dto';

export const userValidation = {
  updateAccountSchema: {
    body: UpdateAccountDTO,
  },
  getUserProfileSchema: {
    params: GetUserProfileDTO,
  },
};
