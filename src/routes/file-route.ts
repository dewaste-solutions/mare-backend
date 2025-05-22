import express from "express";
import { uploadFile } from "../controller/file-upload/upload-file";
import { uploadMiddleware, validateFile } from '../middleware/file-upload/multer-middleware';

export const fileRoutes = express.Router();

// File upload route - single file upload
fileRoutes.post("/upload", uploadMiddleware, validateFile, uploadFile);