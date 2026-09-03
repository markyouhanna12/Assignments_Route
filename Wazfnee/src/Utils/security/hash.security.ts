import bcrypt from 'bcrypt';
import { SALT } from '../../Config/config.service';

export const genrateHash = async (
  plainText: string,
  saltRounds: number = Number(SALT),
): Promise<string> => {
  return await bcrypt.hash(plainText, saltRounds);
};

export const compareHash = async (plainText: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(plainText, hash);
};
