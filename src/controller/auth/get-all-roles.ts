import type { NextFunction, Request, Response } from "express";
import * as HttpStatusCodes from "../../constant/http-status-codes";
import * as HttpStatusPhrases from "../../constant/http-status-phrases";
import { db } from "../../db";
import { roles } from "../../db/schema/auth";

export const getAllRoles = async (
	_req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const allRoles = await db.select({ name: roles.name }).from(roles);

		res
			.status(HttpStatusCodes.OK)
			.json({ message: HttpStatusPhrases.OK, data: allRoles });
		return;
	} catch (error) {
		next(error);
	}
};
