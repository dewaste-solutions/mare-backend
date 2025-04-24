import type { NextFunction, Request, Response } from "express";
import { z } from "zod";

const answerSchema = z.object({
	requirementChoiceAnswerId: z.string().uuid().nullable(),
	requirementsQuestionId: z.string().uuid(),
	answer: z.string().default(""),
});

const bodySchema = z.object({
	answers: z.array(answerSchema),
});

export function validateApplicationSubmit(
	req: Request,
	_res: Response,
	next: NextFunction,
): void {
	const result = bodySchema.safeParse(req.body);
	if (!result.success) {
		const message = `Zod :: ${result.error.errors[0].message} :: ${result.error.errors[0].path}`;
		next(message);
	}

	next();
}
