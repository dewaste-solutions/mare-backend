import type { NextFunction, Request, Response } from "express";
import { z } from "zod";

const QuestionSchema = z.object({
	categoryName: z.string(),
	requirementStep: z.number(),
	sections: z.array(
		z.object({
			sectionName: z.string(),
			sectionOrder: z.number(),
			questions: z.array(
				z.object({
					question: z.string(),
					description: z.string(),
					isRequired: z.boolean(),
					placeholder: z.string(),
					defaultValue: z.string(),
					component: z.enum([
						"radiogroup",
						"input_text",
						"input_email",
						"textarea",
						"date",
						"select_upload",
					]),
					questionOrder: z.string(),
					allowMultiple: z.boolean(),
					choices: z.array(
						z.object({
							choicesName: z.string(),
						}),
					),
				}),
			),
		}),
	),
});

const bodySchemaCreateQuestion = z.object({
	answers: z.array(QuestionSchema),
});

export function validateCreateQuestionByRole(
	req: Request,
	_res: Response,
	next: NextFunction,
): void {
	const result = bodySchemaCreateQuestion.safeParse(req.body);
	if (!result.success) {
		const message = `Zod :: ${result.error.errors[0].message} :: ${result.error.errors[0].path}`;
		next(message);
	}

	next();
}
