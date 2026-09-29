import { BadRequestException } from '@nestjs/common';
import { Request } from 'express';
import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerOptions = {
  storage: diskStorage({
    destination: './uploads',

    filename: (req: Request, file: Express.Multer.File, cb: any) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);

      const ext = extname(file.originalname);

      cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
  }),

  fileFilter: (req: Request, file: Express.Multer.File, cb: any) => {
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf'];

    const extension = extname(file.originalname).toLowerCase();

    if (allowedExtensions.includes(extension)) {
      cb(null, true);
    } else {
      cb(new BadRequestException('Unsupported file format'), false);
    }
  },

  limits: {
    fileSize: 5 * 1024 * 1024,
  },
};
