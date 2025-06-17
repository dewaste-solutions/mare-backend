import type { NextFunction, Request, Response } from "express";
import { z } from "zod";

export const authSigninSchema = z.object({
	email: z.string().email(),
	password: z.string(),
});

export function validateAuthSignIn(
	req: Request,
	_res: Response,
	next: NextFunction,
): void {
	const result = authSigninSchema.safeParse(req.body);

	if (!result.success) {
		const message = `Zod :: ${result.error.errors[0].message} :: ${result.error.errors[0].path}`;
		next(message);
	}

	next();
}
