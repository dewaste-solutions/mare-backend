import { eq } from "drizzle-orm";
import type { NextFunction, Request, Response } from "express";
import { db } from "../../db";
import { files } from "../../db/schema/file";
import { env } from "../../env";

export async function getFileById(
	_req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		const fileId = _req.params.id;
		const [file] = await db.select().from(files).where(eq(files.id, fileId));

		if (!file) {
			res.status(404).json({ message: "File not found" });
			return;
		}

		const fileWithUrl = {
			...file,
			fileUrl: `${env.URL_DOCS_VIEWER}https://res.cloudinary.com/${env.CLOUDINARY_CLOUD_NAME}/raw/upload/${file.publicId}`,
		};

		res.status(200).json(fileWithUrl);
	} catch (error) {
		next(error);
	}
}
