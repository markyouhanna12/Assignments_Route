import { SignUpDTO } from './auth.DTO';

export const authValidation = {
  signupSchema: {
    body: SignUpDTO,
  },
};
