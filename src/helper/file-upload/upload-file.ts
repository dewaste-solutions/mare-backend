import path from "node:path";
import type { NextFunction, Request, Response } from "express";
import { uploadfiles } from "../../middleware/file-upload/multer-middleware";
import { env } from "../../env";

export async function uploadFile(
	_req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		// Handle file upload via the `uploadfiles` middleware
		uploadfiles("file")(_req, res, function (err) {
			// If there's an error in uploading, handle it here
			if (err) {
				return res.status(400).json({
					message: err.message || "Error uploading file",
				});
			}

			if (!_req.file) {
				res.status(400).json({ message: "No file uploaded" });
				return;
			}

			const file = _req.file as Express.Multer.File & {
				path: string;
				filename: string;
				public_id?: string;
			};

			// Extract file information
			const originalName = file.originalname;
			const fileExtension = path.extname(originalName).toLowerCase();
			const fileType = fileExtension === ".pdf" 
				? "pdf" 
				: fileExtension === ".docx" 
				? "docx" 
				: (fileExtension === ".png" || fileExtension === ".jpg" || fileExtension === ".jpeg") 
				? "image" 
				: "unknown";
			const publicId = file.public_id || file.filename;
			const fileUrl = (fileExtension === ".png" || fileExtension === ".jpg" || fileExtension === ".jpeg") ? file.path : `${env.URL_DOCS_VIEWER}${file.path}`;

				res.status(201).json({
					message: "File uploaded successfully",
					file: {
						originalName: originalName,
						fileType: fileType,
						fileUrl: fileUrl,
						publicId: publicId,
					},
				});
			
					
		});
	} catch (error) {
		next(error);
	}
}