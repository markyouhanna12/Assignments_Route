import {
  ConfirmEmailDTO,
  ForgetPasswordDTO,
  GoogleSignInDTO,
  GoogleSignUpDTO,
  RefreshTokenDTO,
  ResetPasswordDTO,
  RestoreAccountConfirmDTO,
  RestoreAccountRequestDTO,
  SignInDTO,
  SignUpDTO,
} from './auth.DTO';

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
  googleSigninSchema: {
    body: GoogleSignInDTO,
  },

  forgetPasswordSchema: {
    body: ForgetPasswordDTO,
  },

  resetPasswordSchema: {
    body: ResetPasswordDTO,
  },

  refreshTokenSchema: {
    body: RefreshTokenDTO,
  },

  restoreAccountRequestSchema: {
    body: RestoreAccountRequestDTO,
  },

  restoreAccountConfirmSchema: {
    body: RestoreAccountConfirmDTO,
  },
};
