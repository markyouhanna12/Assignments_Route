import EventEmitter from 'node:events';
import { generateHTML } from '../email/generateHTML';
import { sendEmail } from '../email/send-email';
import { generateForgotPasswordHTML } from '../email/templates/forgot-password.template';
import { generateRestoreAccountHTML } from '../email/templates/restore-account.template';
import { generateApplicationAcceptedHTML } from '../email/templates/application-accepted.template';
import { generateApplicationRejectedHTML } from '../email/templates/application-rejected.template';

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

interface IRestoreAccountPayload {
  email: string;
  firstName: string;
  otp: string;
}

emailEvents.on('restoreAccount', async (data: IRestoreAccountPayload) => {
  try {
    await sendEmail({
      to: data.email,
      subject: 'Restore your Wazfnee account',
      html: generateRestoreAccountHTML(data.firstName, data.otp),
    });
  } catch (error) {
    console.error('Failed to send restore-account email:', error);
  }
});

interface IApplicationStatusPayload {
  email: string;
  firstName: string;
  jobTitle: string;
  companyName: string;
}

emailEvents.on('applicationAccepted', async (data: IApplicationStatusPayload) => {
  try {
    await sendEmail({
      to: data.email,
      subject: 'Your Application Has Been Accepted - Wazfnee',
      html: generateApplicationAcceptedHTML(data.firstName, data.jobTitle, data.companyName),
    });
  } catch (error) {
    console.error('Failed to send application-accepted email:', error);
  }
});

emailEvents.on('applicationRejected', async (data: IApplicationStatusPayload) => {
  try {
    await sendEmail({
      to: data.email,
      subject: 'Update on Your Job Application - Wazfnee',
      html: generateApplicationRejectedHTML(data.firstName, data.jobTitle, data.companyName),
    });
  } catch (error) {
    console.error('Failed to send application-rejected email:', error);
  }
});
