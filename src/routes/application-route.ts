import express from "express";
import { createQuestionByRole } from "../controller/application/create-question-by-role";
import { getQuestionByRole } from "../controller/application/get-question-by-application";
import { submitApplication } from "../controller/application/submit-application";
import { validateCreateQuestionByRole } from "../middleware/application/create-question-by-role-validate";
import { validateApplicationSubmit } from "../middleware/application/submit-application-validate";
import { checkUserStatus } from "../middleware/check-user-status";
import { checkPermissions } from "../middleware/rabc";
import { RateLimitCategory, applyRateLimit } from "../middleware/rate-limit";

export const applicationRoutes = express.Router();

/**
 * @openapi
 * /api/application/get-application-question:
 *   get:
 *     summary: Get application questions based on user role
 *     description: |
 *       Retrieves a paginated list of application questions organized by categories and sections.
 *
 *       Required Permission:
 *       - none
 *
 *     tags:
 *       - Application
 *     parameters:
 *       - in: query
 *         name: userInvitedId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the invited user
 *       - in: query
 *         name: page
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Successfully retrieved questions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 messages:
 *                   type: string
 *                   example: "OK"
 *                 data:
 *                   type: object
 *                   properties:
 *                     count:
 *                       type: integer
 *                       example: 10
 *                     next:
 *                       type: string
 *                       nullable: true
 *                       example: "/api/application/get-application-question?page=2&limit=10"
 *                     previous:
 *                       type: string
 *                       nullable: true
 *                     result:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           categoryName:
 *                             type: string
 *                           categoryId:
 *                             type: string
 *                           requirementStep:
 *                             type: integer
 *                           sections:
 *                             type: array
 *       400:
 *         description: Bad request - Missing or invalid parameters
 */
applicationRoutes.get(
	"/get-application-question",
	applyRateLimit(RateLimitCategory.LENIENT),
	getQuestionByRole,
);

/**
 * @openapi
 * /api/application/submit-application:
 *   post:
 *     summary: Submit application answers
 *     description: |
 *       Submit answers for application questions.
 *
 *       Required Permission:
 *       - none
 *
 *     tags:
 *       - Application
 *     parameters:
 *       - in: query
 *         name: userInvitedId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the invited user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     requirementChoiceAnswerId:
 *                       type: string
 *                       format: uuid
 *                       nullable: true
 *                     requirementsQuestionId:
 *                       type: string
 *                       format: uuid
 *                     answer:
 *                       type: string
 *           example:
 *             answers:
 *               - requirementChoiceAnswerId: "123e4567-e89b-12d3-a456-426614174000"
 *                 requirementsQuestionId: "123e4567-e89b-12d3-a456-426614174001"
 *                 answer: "Yes, I agree"
 *               - requirementsQuestionId: "123e4567-e89b-12d3-a456-426614174002"
 *                 answer: "My detailed response"
 *     responses:
 *       201:
 *         description: Application submitted successfully
 *       400:
 *         description: Bad request - Invalid input data
 *       500:
 *         description: Server error
 */
applicationRoutes.post(
	"/submit-application",
	applyRateLimit(RateLimitCategory.STRICT),
	validateApplicationSubmit,
	submitApplication,
);

/**
 * @openapi
 * /api/application/create-question-by-role:
 *   post:
 *     summary: Create application questions for a role
 *     description: |
 *       Create a new set of application questions organized by categories and sections for a specific role.
 *
 *       Required Permission:
 *       - create:application-question
 *
 *     tags:
 *       - Application
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Role ID to create questions for
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     categoryName:
 *                       type: string
 *                     requirementStep:
 *                       type: integer
 *                     sections:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           sectionName:
 *                             type: string
 *                           sectionOrder:
 *                             type: integer
 *                           questions:
 *                             type: array
 *                             items:
 *                               type: object
 *           example:
 *             answers:
 *               - categoryName: "Personal Information"
 *                 requirementStep: 1
 *                 sections:
 *                   - sectionName: "Basic Details"
 *                     sectionOrder: 1
 *                     questions:
 *                       - question: "Full Name"
 *                         description: "Enter your full legal name"
 *                         isRequired: true
 *                         placeholder: "John Doe"
 *                         defaultValue: ""
 *                         component: "input_text"
 *                         questionOrder: "1"
 *                         allowMultiple: false
 *                         choices: []
 *                       - question: "Gender"
 *                         description: "Select your gender"
 *                         isRequired: true
 *                         placeholder: ""
 *                         defaultValue: ""
 *                         component: "radiogroup"
 *                         questionOrder: "2"
 *                         allowMultiple: false
 *                         choices:
 *                           - choicesName: "Male"
 *                           - choicesName: "Female"
 *     responses:
 *       201:
 *         description: Questions created successfully
 *       400:
 *         description: Bad request or role already has questions
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       404:
 *         description: Not found - Role does not exist
 *       500:
 *         description: Server error
 */
applicationRoutes.post(
	"/create-question-by-role",
	applyRateLimit(RateLimitCategory.STRICT),
	checkPermissions(["create:application-question"]),
	checkUserStatus("verified"),
	validateCreateQuestionByRole,
	createQuestionByRole,
);
