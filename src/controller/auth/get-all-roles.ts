import type { NextFunction, Request, Response } from "express";
import { db } from "../../db";
import { roles } from "../../db/schema/auth";

export const getAllRoles = async (
	_req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const allRoles = await db
			.select({ id: roles.id, name: roles.name })
			.from(roles);

		res
			.status(200)
			.json({ message: "Roles fetched successfully", data: allRoles });
		return;
	} catch (error) {
		next(error);
	}
};
