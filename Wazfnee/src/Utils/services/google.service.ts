import { OAuth2Client } from 'google-auth-library';
import { GOOGLE_CLIENT_ID } from '../../Config/config.service';
import { UnauthorizedException } from '../response/error.response';

export interface IGooglePayload {
  sub: string;
  email: string;
  email_verified: boolean;
  given_name?: string | undefined;
  family_name?: string | undefined;
  picture?: string | undefined;
}

export class GoogleService {
  private readonly client = new OAuth2Client(GOOGLE_CLIENT_ID);

  verifyToken = async (idToken: string): Promise<IGooglePayload> => {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken,
        audience: GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new UnauthorizedException('Invalid Google credential');
      }
      if (!payload.sub || !payload.email) {
        throw new UnauthorizedException('Invalid Google account information');
      }

      if (!payload.email_verified) {
        throw new UnauthorizedException('Google email is not verified');
      }

      const googlePayload: IGooglePayload = {
        sub: payload.sub,
        email: payload.email,
        email_verified: payload.email_verified,

        ...(payload.given_name && {
          given_name: payload.given_name,
        }),

        ...(payload.family_name && {
          family_name: payload.family_name,
        }),

        ...(payload.picture && {
          picture: payload.picture,
        }),
      };

      return googlePayload;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new UnauthorizedException('Invalid Google credential');
    }
  };
}

export const googleService = new GoogleService();
