import path from "node:path";
import type { NextFunction, Request, Response } from "express";
import { db } from "../../db";
import { files } from "../../db/schema/file";
import { env } from "../../env";

export async function uploadFile(
	_req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
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
		const fileType = fileExtension === ".pdf" ? "pdf" : "docx";
		const publicId = file.public_id || file.filename;

		// Save file information to database
		const [savedFile] = await db
			.insert(files)
			.values({
				originalName,
				fileType,
				publicId,
			})
			.returning();

		// Return success response
		res.status(201).json({
			message: "File uploaded successfully",
			file: {
				id: savedFile.id,
				originalName: savedFile.originalName,
				fileType: savedFile.fileType,
				fileUrl: `${env.URL_DOCS_VIEWER}${env.URL_CLOUDINARY}${savedFile.publicId}`,
			},
		});
	} catch (error) {
		next(error);
	}
}
