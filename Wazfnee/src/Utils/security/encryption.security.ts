import crypto from 'crypto';
import { ENCRYPTION_SECRET_KEY } from '../../Config/config.service';

const IV_LENGTH = 16;

const ENCRYPTION_KEY: Buffer = Buffer.from(ENCRYPTION_SECRET_KEY, 'utf-8');

if (ENCRYPTION_KEY.length !== 32) {
  throw new Error('ENCRYPTION_SECRET_KEY must be 32 bytes for aes-256-cbc ');
}

export const encrypt = async (text: string): Promise<string> => {
  const iv: Buffer = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);

  let encryptedData: string = cipher.update(text, 'utf-8', 'hex');
  encryptedData += cipher.final('hex');

  return `${iv.toString('hex')}:${encryptedData}`;
};

export const decrypt = async (text: string): Promise<string> => {
  const [ivHex, encryptedData] = text.split(':');

  if (!ivHex || !encryptedData) {
    throw new Error('Invalid encrypted text');
  }

  const iv: Buffer = Buffer.from(ivHex, 'hex');

  const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);

  let decryptedData: string = decipher.update(encryptedData, 'hex', 'utf8');

  decryptedData += decipher.final('utf8');

  return decryptedData;
};

export const decryptSync = (text: string): string => {
  const [ivHex, encryptedData] = text.split(':');

  if (!ivHex || !encryptedData) {
    throw new Error('Invalid encrypted text');
  }

  const iv: Buffer = Buffer.from(ivHex, 'hex');

  const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);

  let decryptedData = decipher.update(encryptedData, 'hex', 'utf8');

  decryptedData += decipher.final('utf8');

  return decryptedData;
};
