import nodemailer, { Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { USER_EMAIL, USER_PASSWORD } from '../../Config/config.service';
import Mail from 'nodemailer/lib/mailer';
import { BadRequestException } from '../response/error.response';

const transporter: Transporter<SMTPTransport.SentMessageInfo, SMTPTransport.Options> =
  nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: USER_EMAIL,
      pass: USER_PASSWORD,
    },
  });

export const sendEmail = async (data: Mail.Options): Promise<SMTPTransport.SentMessageInfo> => {
  if (!data.to) {
    throw new BadRequestException('Email recipient is required');
  }

  try {
    const info = await transporter.sendMail({
      ...data,
      from: `"Wazfnee" <${USER_EMAIL}>`,
    });
    console.log(`Email sent successfully: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
