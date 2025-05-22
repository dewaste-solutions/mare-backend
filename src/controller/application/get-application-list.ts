import { eq, count, desc, sql } from "drizzle-orm";
import type { NextFunction, Request, Response } from "express";
import { db } from "../../db";
import {
    invitedUsers,
    onBoarding,
    requirementAnswers,
    requirementQuestion,
} from "../../db/schema/application";
import { statuses } from "../../db/schema/shared";
import { roles, oneTimeTokens } from "../../db/schema/auth";
import { env } from "../../env";

export const getApplicationDetails = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = 10;
        const offset = (page - 1) * limit;

        // Get total count of applications
        const totalCount = await db
            .select({ count: count() })
            .from(onBoarding)
            .then((result) => Number(result[0].count));

        // Get paginated applications
        const applications = await db
            .select({
                id: onBoarding.id,
                status: statuses.name,
                email: invitedUsers.email,
                createdAt: onBoarding.createdAt,
                updatedAt: onBoarding.updatedAt,
                roleName: roles.name,
            })
            .from(onBoarding)
            .innerJoin(invitedUsers, eq(onBoarding.invitedUsersId, invitedUsers.id))
            .innerJoin(statuses, eq(onBoarding.statusId, statuses.id))
            .innerJoin(oneTimeTokens, eq(invitedUsers.oneTimeTokensId, oneTimeTokens.id))
            .innerJoin(roles, eq(roles.id, sql`(${oneTimeTokens.metadata}->>'roleId')::uuid`))
            .orderBy(desc(onBoarding.createdAt))
            .limit(limit)
            .offset(offset);

        if (applications.length === 0) {
            res.status(404).json({ message: "No applications found." });
            return;
        }

        // Get name fields from requirement answers
        const nameAnswers = await db
            .select({
                onboardingId: requirementAnswers.onBoardingId,
                question: requirementQuestion.question,
                answer: requirementAnswers.answer,
                questionId: requirementQuestion.id, // Add questionId for debugging
            })
            .from(requirementAnswers)
            .innerJoin(
                requirementQuestion,
                eq(requirementAnswers.requirementsQuestionId, requirementQuestion.id)
            );


        // Filter for name questions
        const nameAnswersFiltered = nameAnswers.filter(answer => {
            const questionLower = answer.question.toLowerCase();
            return questionLower.includes('first name') || 
                   questionLower.includes('middle name') || 
                   questionLower.includes('last name');
        });


        // Add name fields to applications
        const applicationsWithNames = applications.map(app => {
            const appNameAnswers = nameAnswersFiltered.filter(answer => answer.onboardingId === app.id);

            const firstName = appNameAnswers.find(a => a.question.toLowerCase().includes('first name'))?.answer || "";
            const middleName = appNameAnswers.find(a => a.question.toLowerCase().includes('middle name'))?.answer || "";
            const lastName = appNameAnswers.find(a => a.question.toLowerCase().includes('last name'))?.answer || "";


            return {
                ...app,
                firstName,
                middleName,
                lastName,
            };
        });

        // Return paginated list of applications
        const totalPages = Math.ceil(totalCount / limit);
        const currentPage = page;

        res.status(200).json({
            message: "Applications retrieved successfully",
            data: {
                count: totalCount,
                next: currentPage < totalPages
                    ? `${env.BASE_URL}/api/application/list?page=${currentPage + 1}`
                    : null,
                previous: currentPage > 1
                    ? `${env.BASE_URL}/api/application/list?page=${currentPage - 1}`
                    : null,
                result: applicationsWithNames,
            },
        });
    } catch (error) {
        next(error);
    }
}; 