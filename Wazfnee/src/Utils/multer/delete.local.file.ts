import fs from 'node:fs/promises';
import path from 'node:path';

export const deleteLocalFile = async ({ secureUrl }: { secureUrl: string }): Promise<void> => {
  if (!secureUrl) {
    return;
  }

  const filePath = path.resolve(`.${secureUrl}`);

  try {
    await fs.unlink(filePath);
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      return;
    }

    throw error;
  }
};
