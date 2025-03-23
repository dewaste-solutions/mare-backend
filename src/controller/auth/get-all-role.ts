import type { Request, Response } from "express";
import { db } from "../../db";
import { roles } from "../../db/schema/auth";

export const getAllRole = async (
	_req: Request,
	res: Response,
): Promise<void> => {
	try {
		const allRoles = await db
			.select({ id: roles.id, name: roles.name })
			.from(roles);

		res.status(200).json(allRoles);
		return;
	} catch (_error) {
		res.status(500).json({ message: "Internal server error" });
		return;
	}
};
