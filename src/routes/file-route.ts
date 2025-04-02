import { Router } from "express";
import { uploadFile } from "../controller/file-upload/upload-file";
import { upload } from "../middleware/file-upload/multer-middleware";

const fileRoutes = Router();

// Route for file upload
fileRoutes.post("/upload", upload.single("file"), uploadFile);

export { fileRoutes };
