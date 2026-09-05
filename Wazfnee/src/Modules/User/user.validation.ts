import { GetUserProfileDTO, UpdateAccountDTO, UpdatePasswordDTO } from './user.dto';

export const userValidation = {
  updateAccountSchema: {
    body: UpdateAccountDTO,
  },
  getUserProfileSchema: {
    params: GetUserProfileDTO,
  },
  updatePasswordSchema: {
    body: UpdatePasswordDTO,
  },
};
