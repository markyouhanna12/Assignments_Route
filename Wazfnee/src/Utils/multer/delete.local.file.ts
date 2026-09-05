import fs from 'node:fs/promises';
import path from 'node:path';

export const deleteLocalFile = async (secureUrl: string): Promise<void> => {
  if (!secureUrl) {
    return;
  }

  const relativePath = secureUrl.replace(/^\/+/, '');

  const filePath = path.join(process.cwd(), relativePath);

  console.log('Deleting file:', filePath);

  try {
    await fs.unlink(filePath);

    console.log('File deleted successfully');
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      console.log('File does not exist:', filePath);
      return;
    }

    console.error('Failed to delete file:', error);
    throw error;
  }
};
