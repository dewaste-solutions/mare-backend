import { Request, Response, NextFunction } from 'express';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client, bucketName } from '../../services/digitalOcean';
import path from 'node:path';
import { env } from '../../env';

export const uploadFile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      res.status(400).json({ error: 'No files uploaded' });
      return;
    }

    const uploadPromises = req.files.map(async (file) => {
      const fileExtension = path.extname(file.originalname);
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}${fileExtension}`;

      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
      });

      await s3Client.send(command);

      // Construct the file URL
      return {
        originalName: file.originalname,
        fileUrl: `${env.DO_SPACES_ENDPOINT}/${bucketName}/${fileName}`,
      };
    });

    const uploadedFiles = await Promise.all(uploadPromises);

    res.json({
      message: 'Files uploaded successfully',
      files: uploadedFiles,
    });
  } catch (error) {
    next(error);
  }
};