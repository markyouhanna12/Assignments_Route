import multer, { FileFilterCallback, StorageEngine } from 'multer';
import { Request } from 'express';
import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';

export const fileValidation = {
  images: {
    mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    extensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
  },

  pdf: {
    mimeTypes: ['application/pdf'],
    extensions: ['.pdf'],
  },

  excel: {
    mimeTypes: [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
    ],
    extensions: ['.xlsx', '.xls'],
  },

  documents: {
    mimeTypes: [
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    extensions: ['.doc', '.docx'],
  },

  videos: {
    mimeTypes: ['video/mp4', 'video/mpeg', 'video/quicktime'],
    extensions: ['.mp4', '.mpeg', '.mov'],
  },

  audio: {
    mimeTypes: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
    extensions: ['.mp3', '.wav', '.ogg'],
  },
} as const;

interface LocalFileUploadOptions {
  customPath?: string;

  validation?: {
    mimeTypes: readonly string[];
    extensions: readonly string[];
  };

  maxFileSize?: number;
}

export const localFileUpload = ({
  customPath = 'general',
  validation,
  maxFileSize = 5 * 1024 * 1024,
}: LocalFileUploadOptions = {}): multer.Multer => {
  /*
   * Base upload directory
   *
   * Example:
   * uploads/profile/
   * uploads/cover/
   */
  const basePath = path.resolve('./uploads', customPath);

  const storage: StorageEngine = multer.diskStorage({
    destination(req: Request, file: Express.Multer.File, cb): void {
      let uploadPath = basePath;

      /*
       * If the user is authenticated,
       * store their files inside their own folder.
       *
       * Example:
       * uploads/profile/6a983bde6cf3c6f8915ed5ea/
       */
      if (req.user?._id) {
        uploadPath = path.join(basePath, req.user._id.toString());
      }

      /*
       * Create the directory if it doesn't exist.
       */
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, {
          recursive: true,
        });
      }

      cb(null, uploadPath);
    },

    filename(req: Request, file: Express.Multer.File, cb): void {
      /*
       * Keep the original extension.
       *
       * Example:
       * ghost of yotei image.jpg
       *          ↓
       * 550e8400-e29b-41d4-a716-446655440000.jpg
       */
      const extension = path.extname(file.originalname).toLowerCase();

      /*
       * Generate a unique filename
       * to avoid collisions.
       */
      const filename = `${crypto.randomUUID()}${extension}`;

      cb(null, filename);
    },
  });

  const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
    /*
     * No validation was provided.
     * Accept the file.
     */
    if (!validation) {
      return cb(null, true);
    }

    const extension = path.extname(file.originalname).toLowerCase();

    const validMimeType = validation.mimeTypes.includes(file.mimetype);

    const validExtension = validation.extensions.includes(extension);

    /*
     * We accept the file when either:
     *
     * 1. MIME type is valid
     * OR
     * 2. File extension is valid
     *
     * This handles cases like Postman sending
     * application/octet-stream for a .jpg file.
     */
    if (!validMimeType && !validExtension) {
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
