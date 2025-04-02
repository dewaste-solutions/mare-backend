import { Router } from "express";
import { uploadFile } from "../controller/file-upload/upload-file";
import { uploadfiles } from "../middleware/file-upload/multer-middleware";

const fileRoutes = Router();

// Route for file upload
fileRoutes.post("/upload", uploadfiles("file"), uploadFile);

export { fileRoutes };
