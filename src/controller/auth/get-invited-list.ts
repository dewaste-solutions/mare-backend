import type { Request, Response } from "express";
import { db } from "../../db/index";
import {
	invitedUsers,
	onboarding,
	requirementAnswers,
	requirementAnswersFiles,
} from "../../db/schema/auth";

export const getInvitedList = async (_req: Request, res: Response) => {
	try {
		// Fetch all invited users from the database
		const invitedList = await db.select().from(invitedUsers);

		// Fetch onboarding data
		const onboardingData = await db.select().from(onboarding);

		// Fetch requirement answers
		const answers = await db.select().from(requirementAnswers);

		// Fetch requirement answer files
		const answerFiles = await db.select().from(requirementAnswersFiles);

		res.status(200).json({
			success: true,
			message: "Data fetched successfully",
			data: {
				invitedUsers: invitedList,
				onboarding: onboardingData,
				requirementAnswers: answers,
				requirementAnswerFiles: answerFiles,
			},
		});
	} catch (_error) {
		res.status(500).json({
			success: false,
			message: "Failed to fetch data.",
		});
	}
};
