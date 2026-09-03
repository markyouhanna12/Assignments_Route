import EventEmitter from 'node:events';
import { generateHTML } from '../email/generateHTML';
import { sendEmail } from '../email/send-email';
import { generateForgotPasswordHTML } from '../email/templates/forgot-password.template';

export const emailEvents = new EventEmitter();

interface IConfirmEmailPayload {
  email: string;
  firstName: string;
  otp: string;
}

emailEvents.on('confirmEmail', async (data: IConfirmEmailPayload) => {
  try {
    const html = generateHTML(data.firstName, data.otp);

    await sendEmail({
      to: data.email,
      subject: 'Confirm Your Email - Wazfnee',
      html,
    });
  } catch (error) {
    console.error('Failed to send confirmation email:', error);
  }
});

interface IForgotPasswordPayload {
  email: string;
  firstName: string;
  otp: string;
}

emailEvents.on('forgetPassword', async (data: IForgotPasswordPayload) => {
  try {
    await sendEmail({
      to: data.email,
      subject: 'Reset Your Password - Wazfnee',
      html: generateForgotPasswordHTML(data.firstName, data.otp),
    });
  } catch (error) {
    console.error('Failed to send forgot-password email:', error);
  }
});
