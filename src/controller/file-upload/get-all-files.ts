import type { NextFunction, Request, Response } from "express";
import { db } from "../../db";
import { files } from "../../db/schema/file";
import { env } from "../../env";

export async function getAllFiles(
	_req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		const fileList = await db.select().from(files).orderBy(files.createdAt);

		// Transform the results to include fileUrl
		const filesWithUrls = fileList.map((file) => ({
			...file,
			fileUrl: `${env.URL_DOCS_VIEWER}https://res.cloudinary.com/${env.CLOUDINARY_CLOUD_NAME}/raw/upload/${file.publicId}`,
		}));

		res.status(200).json({
			files: filesWithUrls,
		});
	} catch (error) {
		next(error);
	}
}
