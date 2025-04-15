import { eq, inArray, sql } from "drizzle-orm";
import type { NextFunction, Request, Response } from "express";
import { db } from "../../db";
import {
	invitedUsers,
	requirementCategories,
	requirementChoices,
	requirementQuestion,
	requirementSections,
} from "../../db/schema/application";
import { oneTimeTokens } from "../../db/schema/auth";

export const getQuestionByRole = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const userInvitedId = req.query.userInvitedId as string | undefined;
		const page = req.query.page as number | undefined;
		const limit = req.query.limit as number | undefined;
		if (!userInvitedId) {
			res.status(400).json({ message: "userInvitedId is required." });
			return;
		}
		if (!page) {
			res.status(400).json({ message: "page is required." });
			return;
		}
		if (!limit) {
			res.status(400).json({ message: "limit is required." });
			return;
		}
		const offset = (Number(page) - 1) * Number(limit) || 0;

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

		// Get total count of categories for pagination
		const totalCount = await db
			.select({ count: sql<number>`count(*)` })
			.from(requirementCategories)
			.where(eq(requirementCategories.roleId, roleIdParsed.roleId))
			.then((result) => result[0].count);

		// First get the paginated categories
		const paginatedCategories = await db
			.select({
				id: requirementCategories.id,
				name: requirementCategories.name,
				requirementStep: requirementCategories.requirementStep,
			})
			.from(requirementCategories)
			.where(eq(requirementCategories.roleId, roleIdParsed.roleId))
			.orderBy(requirementCategories.requirementStep)
			.limit(Number(limit))
			.offset(offset);

		const paginatedCategoryIds = paginatedCategories.map((cat) => cat.id);

		// Then get all data for these categories
		const categoriesWithSectionsAndQuestions = await db
			.select({
				category: {
					id: requirementCategories.id,
					name: requirementCategories.name,
					requirementStep: requirementCategories.requirementStep,
				},
				section: {
					id: requirementSections.id,
					name: requirementSections.name,
					order: requirementSections.order,
				},
				question: {
					id: requirementQuestion.id,
					question: requirementQuestion.question,
					description: requirementQuestion.description,
					isRequired: requirementQuestion.isRequired,
					placeholder: requirementQuestion.placeholder,
					defaultValue: requirementQuestion.defaultValue,
					component: requirementQuestion.component,
					order: requirementQuestion.order,
					allowMultiple: requirementQuestion.allowMultiple,
				},
				choice: {
					name: requirementChoices.name,
					id: requirementChoices.id,
				},
			})
			.from(requirementCategories)
			.where(
				// Use `IN` clause to match paginated categories only
				inArray(requirementCategories.id, paginatedCategoryIds),
			)
			.leftJoin(
				requirementSections,
				eq(requirementSections.requirementCategoryId, requirementCategories.id),
			)
			.leftJoin(
				requirementQuestion,
				eq(requirementQuestion.requirementSectionId, requirementSections.id),
			)
			.leftJoin(
				requirementChoices,
				eq(requirementChoices.requirementQuestionId, requirementQuestion.id),
			)
			.orderBy(
				requirementCategories.requirementStep,
				requirementSections.order,
				requirementQuestion.order,
			);

		// Transform the flat structure into nested format
		const nestedStructure = categoriesWithSectionsAndQuestions.reduce(
			(acc, row) => {
				// Find or create category
				let category = acc.find((c) => c.categoryName === row.category.name);
				if (!category) {
					category = {
						categoryName: row.category.name,
						categoryId: row.category.id,
						requirementStep: row.category.requirementStep,
						sections: [],
					};
					acc.push(category);
				}

				// Find or create section
				if (row.section?.id) {
					let section = category.sections.find(
						(s) => s.sectionName === row.section?.name,
					);
					if (!section) {
						section = {
							sectionName: row.section.name,
							sectionId: row.section.id,
							sectionOrder: row.section.order,
							questions: [],
						};
						category.sections.push(section);
					}

					// Add question if it exists
					if (row.question?.id) {
						let question = section.questions.find(
							(q) => q.question === row.question?.question,
						);
						if (!question) {
							question = {
								question: row.question.question,
								questionId: row.question.id,
								description: row.question.description,
								isRequired: row.question.isRequired,
								placeholder: row.question.placeholder,
								defaultValue: row.question.defaultValue,
								component: row.question.component,
								order: row.question.order,
								allowMultiple: row.question.allowMultiple,
								choices: [],
							};
							section.questions.push(question);
						}

						// Add choice if it exists
						if (row.choice?.name) {
							question.choices?.push({
								name: row.choice.name,
								id: row.choice.id,
							});
						}
					}
				}

				return acc;
			},
			[] as Array<{
				categoryName: string;
				categoryId: string;
				requirementStep: number;
				sections: Array<{
					sectionName: string;
					sectionId: string;
					sectionOrder: number;
					questions: Array<{
						question: string;
						questionId: string;
						description: string;
						isRequired: boolean;
						placeholder: string;
						defaultValue: string;
						component: string;
						order: number | null;
						allowMultiple: boolean;
						choices?: Array<{
							name: string;
							id: string;
						}>;
					}>;
				}>;
			}>,
		);

		res.status(200).json({
			messages: "Successfully retrieved application questions",
			data: {
				count: totalCount,
				next: "",
				previous: "",
				result: nestedStructure,
			},
		});
		return;
	} catch (error) {
		next(error);
	}
};
