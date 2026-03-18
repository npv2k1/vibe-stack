import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import multer from 'multer';

// Core middleware to handle file uploads
@Injectable()
export class CoreMiddleware implements NestMiddleware {
  private upload: multer.Multer;

  constructor() {
    this.upload = multer({
      storage: multer.memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB/file
    });
  }

  use(req: Request, res: Response, next: NextFunction) {
    // Accept both single file (field: 'file') and multiple files (field: 'files')
    const fields = [
      { name: 'file', maxCount: 1 },
      { name: 'files', maxCount: 20 }, // adjust maxCount as needed
    ];

    this.upload.fields(fields)(req, res, (err: any) => {
      if (err) {
        throw new BadRequestException('File upload failed: ' + err.message);
      }

      // Handle single file: req.files['file'] is an array with one element (if present)
      if (
        req.files &&
        (req.files as any)['file'] &&
        Array.isArray((req.files as any)['file'])
      ) {
        const singleFile = (req.files as any)['file'][0];
        if (singleFile) {
          req.body.file = singleFile;
        }
      }

      // Handle multiple files: req.files['files'] is an array (if present)
      if (
        req.files &&
        (req.files as any)['files'] &&
        Array.isArray((req.files as any)['files'])
      ) {
        req.body.files = (req.files as any)['files'];
      }

      next();
    });
  }
}
