import express from "express";
import { uploadFile } from "../controller/file-upload/upload-file";
import { deleteFile } from "../controller/file-upload/delete-file";

export const fileRoutes = express.Router();

// File upload route - single file upload
fileRoutes.post("/upload", uploadFile);

// File delete route - using * to capture the entire path including slashes and encoded characters
fileRoutes.delete("/delete", deleteFile);