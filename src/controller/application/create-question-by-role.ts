import { eq, sql } from "drizzle-orm";
import type { NextFunction, Request, Response } from "express";
import * as HttpStatusCodes from "../../constant/http-status-codes";
import * as HttpStatusPhrases from "../../constant/http-status-phrases";
import { db } from "../../db";
import {
	requirementCategories,
	requirementChoices,
	requirementQuestion,
	requirementSections,
} from "../../db/schema/application";
import { roles } from "../../db/schema/auth";

type ComponentType =
	| "radiogroup"
	| "input_text"
	| "input_email"
	| "textarea"
	| "date"
	| "select_upload";

type QuestionType = {
	categoryName: string;
	requirementStep: number;
	sections: {
		sectionName: string;
		sectionOrder: number;
		questions: {
			question: string;
			description: string;
			isRequired: boolean;
			placeholder: string;
			defaultValue: string;
			component: ComponentType;
			questionOrder: string;
			allowMultiple: boolean;
			choices: {
				choicesName: string;
			}[];
		}[];
	}[];
};

export const createQuestionByRole = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const { answers } = req.body as { answers: QuestionType[] };
		const role = req.query.role as string | undefined;

		if (!role) {
			res
				.status(HttpStatusCodes.BAD_REQUEST)
				.json({ message: HttpStatusPhrases.BAD_REQUEST });
			return;
		}

		// check if there an existing role in the category table
		const existingRole = await db
			.select({ id: requirementCategories.id })
			.from(requirementCategories)
			.where(eq(requirementCategories.roleId, role))
			.limit(1);

		if (existingRole.length > 0) {
			res
				.status(HttpStatusCodes.BAD_REQUEST)
				.json({ message: HttpStatusPhrases.BAD_REQUEST });
			return;
		}

		await db.transaction(async (tx) => {
			const roleResult = await tx
				.select({ id: roles.id })
				.from(roles)
				.where(eq(roles.id, role));
			if (roleResult.length === 0) {
				res
					.status(HttpStatusCodes.NOT_FOUND)
					.json({ message: HttpStatusPhrases.NOT_FOUND });
				return;
			}

			await Promise.all(
				answers.map(async (category: QuestionType) => {
					const categoryResult = await tx
						.insert(requirementCategories)
						.values({
							name: category.categoryName,
							requirementStep: category.requirementStep,
							updatedAt: sql`NOW()`,
							roleId: roleResult[0].id,
						})
						.returning({ id: requirementCategories.id });

					await Promise.all(
						category.sections.map(async (section) => {
							const sectionResult = await tx
								.insert(requirementSections)
								.values({
									name: section.sectionName,
									requirementCategoryId: categoryResult[0].id,
									order: section.sectionOrder,
									updatedAt: sql`NOW()`,
								})
								.returning({ id: requirementSections.id });

							await Promise.all(
								section.questions.map(async (question) => {
									const questionResult = await tx
										.insert(requirementQuestion)
										.values({
											question: question.question,
											description: question.description,
											isRequired: question.isRequired,
											placeholder: question.placeholder,
											defaultValue: question.defaultValue,
											component: question.component,
											order: question.questionOrder,
											allowMultiple: question.allowMultiple,
											requirementSectionId: sectionResult[0].id,
											updatedAt: sql`NOW()`,
										})
										.returning({ id: requirementQuestion.id });

									if (question.choices.length > 0) {
										await Promise.all(
											question.choices.map(async (choice) => {
												await tx.insert(requirementChoices).values({
													name: choice.choicesName,
													requirementQuestionId: questionResult[0].id,
													updatedAt: sql`NOW()`,
												});
											}),
										);
									}
								}),
							);
						}),
					);
				}),
			);
		});

		res
			.status(HttpStatusCodes.CREATED)
			.json({ message: HttpStatusPhrases.CREATED });
		return;
	} catch (error) {
		next(error);
	}
};
