import { eq } from "drizzle-orm";
import type { NextFunction, Request, Response } from "express";
import { db } from "../../db";
import {
    requirementAnswers,
    requirementChoices,
    requirementQuestion,
    requirementSections,
    requirementCategories,
} from "../../db/schema/application";

export const getApplicationDetailsById = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const onboardingId = req.query.onboardingId as string | undefined;

        if (!onboardingId) {
            res.status(400).json({ message: "onboardingId is required." });
            return;
        }

        // Get all answers for the application
        const answers = await db
            .select({
                questionId: requirementQuestion.id,
                question: requirementQuestion.question,
                answer: requirementAnswers.answer,
                choiceAnswer: requirementChoices.name,
                sectionName: requirementSections.name,
                sectionOrder: requirementSections.order,
                categoryName: requirementCategories.name,
                categoryStep: requirementCategories.requirementStep,
            })
            .from(requirementAnswers)
            .innerJoin(
                requirementQuestion,
                eq(requirementAnswers.requirementsQuestionId, requirementQuestion.id)
            )
            .leftJoin(
                requirementChoices,
                eq(requirementAnswers.requirementChoiceAnswerId, requirementChoices.id)
            )
            .innerJoin(
                requirementSections,
                eq(requirementQuestion.requirementSectionId, requirementSections.id)
            )
            .innerJoin(
                requirementCategories,
                eq(requirementSections.requirementCategoryId, requirementCategories.id)
            )
            .where(eq(requirementAnswers.onBoardingId, onboardingId))
            .orderBy(requirementCategories.requirementStep);

        // Organize answers by section
        const organizedAnswers = answers.reduce((acc, answer) => {
            const sectionName = answer.sectionName;

            if (!acc[sectionName]) {
                acc[sectionName] = [];
            }

            acc[sectionName].push({
                question: answer.question,
                answer: answer.answer || "",
                choiceAnswer: answer.choiceAnswer,
            });

            return acc;
        }, {} as Record<string, Array<{
            question: string;
            answer: string;
            choiceAnswer: string | null;
        }>>);

        res.status(200).json({
            message: "Application details retrieved successfully",
            data: organizedAnswers,
        });
    } catch (error) {
        next(error);
    }
}; 