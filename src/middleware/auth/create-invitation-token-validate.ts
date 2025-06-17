import type { NextFunction, Request, Response } from "express";
import { z } from "zod";

export const authInvitationSchema = z.object({
	roleId: z.string(),
	emailTo: z.string().email(),
});

export function validateAuthInvitation(
	req: Request,
	_res: Response,
	next: NextFunction,
): void {
	const result = authInvitationSchema.safeParse(req.body);

	if (!result.success) {
		const message = `Zod :: ${result.error.errors[0].message} :: ${result.error.errors[0].path}`;
		next(message);
		return;
	}

	next();
}
