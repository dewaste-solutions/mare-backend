import { eq, sql } from "drizzle-orm";
import type { NextFunction, Request, Response } from "express";
import * as HttpStatusCodes from "../../constant/http-status-codes";
import * as HttpStatusPhrases from "../../constant/http-status-phrases";
import { db } from "../../db";
import { onBoarding, requirementAnswers } from "../../db/schema/application";
import { statuses } from "../../db/schema/shared";

type AnswerInputType = {
	requirementChoiceAnswerId?: string;
	requirementsQuestionId: string;
	answer: string;
};

export const submitApplication = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const { answers } = req.body as { answers: AnswerInputType[] };
		const userInvitedId = req.query.userInvitedId as string | undefined;
		if (!userInvitedId) {
			res
				.status(HttpStatusCodes.BAD_REQUEST)
				.json({ message: HttpStatusPhrases.BAD_REQUEST });
			return;
		}

		await db.transaction(async (tx) => {
			const statusResult = await tx
				.select({ id: statuses.id })
				.from(statuses)
				.where(eq(statuses.name, "pending"));

			const onBoardingId = await tx
				.insert(onBoarding)
				.values({
					statusId: statusResult[0].id,
					invitedUsersId: userInvitedId,
					updatedAt: sql`NOW()`,
				})
				.returning({ id: onBoarding.id });

			const insertData = answers.map((answer) => ({
				requirementChoiceAnswerId: answer.requirementChoiceAnswerId,
				requirementsQuestionId: answer.requirementsQuestionId, // change this into requirementQuestionId
				answer: answer.answer || "",
				updatedAt: sql`NOW()`,
				onBoardingId: onBoardingId[0].id,
			}));

			await tx.insert(requirementAnswers).values(insertData);
		});

		res
			.status(HttpStatusCodes.CREATED)
			.json({ message: HttpStatusPhrases.CREATED });
		return;
	} catch (error) {
		next(error);
	}
};
