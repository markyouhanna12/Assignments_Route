import EventEmitter from 'node:events';
import Mail from 'nodemailer/lib/mailer';
import { generateHTML as template } from '../email/generateHTML.js';
import { sendEmail } from '../email/send.email';

export const emailEvents = new EventEmitter();

interface IEmail extends Mail.Options {
  otp: string;
  username: string;
}

emailEvents.on('confirmEmail', async (data: IEmail) => {
  try {
    data.subject = 'Confirm Email';
    data.html = template(data.username, data.otp);
    await sendEmail(data);
  } catch (error) {
    console.error('Fail to send email', error);
  }
});
