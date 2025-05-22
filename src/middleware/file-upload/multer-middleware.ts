import { Request, Response, NextFunction } from 'express';
import multer from 'multer';

export const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png"
] as const;

type AllowedFileType = typeof ALLOWED_FILE_TYPES[number];

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

// Configure multer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 5, // Maximum number of files allowed
  },
});

// Export multer middleware with error handling
export const uploadMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  upload.array('files', 5)(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        res.status(400).json({
          error: 'Invalid file size 5mb max per file.'
        });
        return;
      }
      if (err.code === 'LIMIT_FILE_COUNT') {
        res.status(400).json({
          error: 'Too many files. Maximum 5 files allowed.'
        });
        return;
      }
    }
    next(err);
  });
};

export const validateFile = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
    res.status(400).json({
      error: 'No files uploaded'
    });
    return;
  }

  // Check file types for all files
  const invalidFiles = req.files.filter(file => !ALLOWED_FILE_TYPES.includes(file.mimetype as AllowedFileType));
  if (invalidFiles.length > 0) {
    res.status(400).json({
      error: 'Invalid file type. Only PNG, JPEG, PDF and DOCX files are allowed.',
      invalidFiles: invalidFiles.map(file => file.originalname)
    });
    return;
  }

  next();
}; 