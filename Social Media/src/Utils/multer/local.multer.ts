import multer, { FileFilterCallback, StorageEngine } from 'multer';
import { Request } from 'express';
import path from 'path';
import fs from 'node:fs';

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
      };
    }

    namespace Multer {
      interface File {
        finalPath?: string;
      }
    }
  }
}

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
}

export const localFileUpload = ({
  customPath = 'general',
  validation,
}: LocalFileUploadOptions): multer.Multer => {
  const basePath = `uploads/${customPath}`;

  const storage: StorageEngine = multer.diskStorage({
    destination: (
      req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, destination: string) => void,
    ): void => {
      let userBasePath = basePath;

      if (req.user?._id) {
        userBasePath += `/${req.user._id}`;
      }

      const fullPath = path.resolve(`./src/${userBasePath}`);

      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }

      cb(null, fullPath);
    },

    filename: (
      req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, filename: string) => void,
    ): void => {
      const uniqueFileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${file.originalname}`;

      file.finalPath = req.user?._id
        ? `${basePath}/${req.user._id}/${uniqueFileName}`
        : `${basePath}/${uniqueFileName}`;

      cb(null, uniqueFileName);
    },
  });

  const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
    if (validation && !validation.includes(file.mimetype)) {
      console.log('File type not allowed:', file.mimetype);
      return cb(new Error('Invalid file type'));
    }

    cb(null, true);
  };

  return multer({
    storage,
    fileFilter,
  });
};
