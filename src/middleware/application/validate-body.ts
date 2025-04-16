import { count, eq } from "drizzle-orm";
import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { db } from "../../db";
import {
	invitedUsers,
	requirementCategories,
	requirementQuestion,
	requirementSections,
} from "../../db/schema/application";
import { oneTimeTokens } from "../../db/schema/auth";

export async function validateApplicationSubmit(
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> {
	const userInvitedId = req.query.userInvitedId as string | undefined;
	if (!userInvitedId) {
		res.status(400).json({ message: "userInvitedId is required." });
		return;
	}
	const filterRole = await db
		.select()
		.from(invitedUsers)
		.where(eq(invitedUsers.id, userInvitedId))
		.innerJoin(
			oneTimeTokens,
			eq(oneTimeTokens.id, invitedUsers.oneTimeTokensId),
		);
	const metadata = filterRole[0].one_time_tokens.metadata;
	const roleIdString = JSON.stringify(metadata);
	const roleIdParsed = JSON.parse(roleIdString);
	if (!roleIdParsed.roleId) {
		res.status(400).json({ message: "roleId not found." });
		return;
	}

	const countQuestion = await db
		.select({ count: count() })
		.from(requirementQuestion)
		.leftJoin(
			requirementSections,
			eq(requirementQuestion.requirementSectionId, requirementSections.id),
		)
		.leftJoin(
			requirementCategories,
			eq(requirementSections.requirementCategoryId, requirementCategories.id),
		)
		.where(eq(requirementCategories.roleId, roleIdParsed.roleId));

	if (countQuestion.length === 0) {
		res.status(400).json({ message: "No questions found for this role." });
		return;
	}

	const answerSchema = z.object({
		requirementChoiceAnswerId: z.string().uuid().optional(),
		requirementsQuestionId: z.string().uuid(),
		answer: z.string().default(""),
	});

	const applicationSubmitSchema = z.object({
		answers: z
			.array(answerSchema)
			.min(
				countQuestion[0].count,
				`answers must be equal to the number (${countQuestion[0].count}) of questions`,
			)
			.max(
				countQuestion[0].count,
				`answers must be equal to the number (${countQuestion[0].count}) of questions`,
			),
	});

	const result = applicationSubmitSchema.safeParse(req.body);
	if (!result.success) {
		const message = `Zod :: ${result.error.errors[0].message} :: ${result.error.errors[0].path}`;
		next(message);
	}

	next();
}
