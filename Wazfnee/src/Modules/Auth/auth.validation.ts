import { ConfirmEmailDTO, SignUpDTO } from './auth.DTO';

export const authValidation = {
  signupSchema: {
    body: SignUpDTO,
  },
  confirmEmailSchema: {
    body: ConfirmEmailDTO,
  },
};
