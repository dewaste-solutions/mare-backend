import { Router } from "express";
import { getAllFiles } from "../controller/file-upload/get-all-files";
import { getFileById } from "../controller/file-upload/get-file";
import { uploadFile } from "../controller/file-upload/upload-file";
import { upload } from "../middleware/file-upload/multer-middleware";

const fileRoutes = Router();

// Route for file upload
fileRoutes.post("/upload", upload.single("file"), uploadFile);

// Route to get all files
fileRoutes.get("/files", getAllFiles);

// Route to get a specific file by ID
fileRoutes.get("/files/:id", getFileById);

export { fileRoutes };
