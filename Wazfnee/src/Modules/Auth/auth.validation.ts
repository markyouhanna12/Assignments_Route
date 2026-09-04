import { ConfirmEmailDTO, GoogleSignUpDTO, SignInDTO, SignUpDTO } from './auth.DTO';

export const authValidation = {
  signupSchema: {
    body: SignUpDTO,
  },
  confirmEmailSchema: {
    body: ConfirmEmailDTO,
  },
  signinSchema: {
    body: SignInDTO,
  },
  googleSignupSchema: {
    body: GoogleSignUpDTO,
  },
};
