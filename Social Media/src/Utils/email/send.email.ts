import nodemailer, { Transporter } from 'nodemailer';
import { USER_EMAIL, USER_PASSWORD } from '../../config/config.service';
import Mail from 'nodemailer/lib/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { BadRequestException } from '../response/error.response';

export const sendEmail = async (data: Mail.Options): Promise<any> => {
  if (!data.html && !data.attachments && !data.text) {
    throw new BadRequestException('Missing Email Content');
  }

  const transporter: Transporter<SMTPTransport.SentMessageInfo, SMTPTransport.Options> =
    nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: USER_EMAIL as string,
        pass: USER_PASSWORD as string,
      },
    });
  try {
    const info = await transporter.sendMail({
      ...data,
      from: `"Social Media App" <${USER_EMAIL as string}>`,
    });
    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
