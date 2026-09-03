import multer, { FileFilterCallback, StorageEngine } from 'multer';

import { Request } from 'express';
import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';

export const fileValidation = {
  images: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],

  pdf: ['application/pdf'],
  excel: [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
  ],

  documents: [
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],

  videos: ['video/mp4', 'video/mpeg', 'video/quicktime'],

  audio: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
} as const;

interface LocalFileUploadOptions {
  customPath?: string;
  validation?: readonly string[];
  maxFileSize?: number;
}

export const localFileUpload = ({
  customPath = 'general',
  validation,
  maxFileSize = 5 * 1024 * 1024,
}: LocalFileUploadOptions = {}): multer.Multer => {
  const basePath = path.resolve('./uploads', customPath);

  const storage: StorageEngine = multer.diskStorage({
    destination: (
      req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, destination: string) => void,
    ): void => {
      let uploadPath = basePath;
      if (req.user?._id) {
        uploadPath = path.join(basePath, req.user._id.toString());
      }
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, {
          recursive: true,
        });
      }
      cb(null, uploadPath);
    },
    filename: (
      req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, filename: string) => void,
    ): void => {
      const extension = path.extname(file.originalname);

      const filename = `${crypto.randomUUID()}${extension}`;

      cb(null, filename);
    },
  });

  const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
    if (validation && !validation.includes(file.mimetype)) {
      return cb(new Error('Invalid file type'));
    }
    cb(null, true);
  };

  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize: maxFileSize,
    },
  });
};
