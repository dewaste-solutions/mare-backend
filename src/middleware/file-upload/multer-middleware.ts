import path from "node:path";
import type { NextFunction, Request, Response } from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinary } from "../../services/cloudinary.service";

interface CloudinaryStorageParams {
	folder: string;
	resource_type: string;
	public_id: (req: Request, file: Express.Multer.File) => string;
	filename: (req: Request, file: Express.Multer.File) => string;
}

const ALLOWED_FILE_TYPES = [
	"application/pdf",
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const ALLOWED_FILE_EXTENSIONS = [".pdf", ".docx"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
	cloudinary: cloudinary,
	params: {
		folder: "file-uploads",
		resource_type: "raw",
		public_id: (_req: Request, file: Express.Multer.File) => {
			// Use the original filename without extension as the public_id
			const fileNameWithoutExt = path.parse(file.originalname).name;
			return `${fileNameWithoutExt}-${Date.now()}`;
		},
		filename: (_req: Request, file: Express.Multer.File) => {
			// Return the original filename directly
			return file.originalname;
		},
	} as CloudinaryStorageParams,
});

// File filter to check file types
const fileFilter = (
	_req: Request,
	file: Express.Multer.File,
	cb: multer.FileFilterCallback,
) => {
	const ext = path.extname(file.originalname).toLowerCase();

	if (
		ALLOWED_FILE_TYPES.includes(file.mimetype) &&
		ALLOWED_FILE_EXTENSIONS.includes(ext)
	) {
		cb(null, true);
	} else {
		cb(new Error("Invalid file type. Only PDF and DOCX files are allowed."));
	}
};

// Configure multer
const upload = multer({
	storage: storage,
	fileFilter: fileFilter,
	limits: {
		fileSize: MAX_FILE_SIZE, // 5MB max file size
	},
});

// Create a wrapper function for the upload middleware with error handling
const uploadfiles = (fieldName: string) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const uploadHandler = upload.single(fieldName);

		uploadHandler(req, res, (err) => {
			if (err instanceof multer.MulterError) {
				// Handle Multer errors
				if (err.code === "LIMIT_FILE_SIZE") {
					return res.status(400).json({
						message: "Invalid file size. 5mb max",
					});
				}
				return res.status(400).json({
					message: err.message || "Error uploading file",
				});
			}

			if (err) {
				// Handle custom errors from fileFilter
				if (err.message.includes("Invalid file type")) {
					return res.status(400).json({
						message: "Invalid file type. Only PDF and DOCX files are allowed.",
					});
				}
				// Handle unexpected errors
				return res.status(500).json({
					message: "Internal server error",
				});
			}

			// No errors, proceed to the next middleware
			next();
		});
	};
};

export { uploadfiles };
