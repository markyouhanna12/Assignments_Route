import { UpdateAccountDTO } from './user.dto';

export const userValidation = {
  updateAccountSchema: {
    body: UpdateAccountDTO,
  },
};
