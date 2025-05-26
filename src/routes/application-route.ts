import express from "express";
import { createQuestionByRole } from "../controller/application/create-question-by-role";
import { getQuestionByApplication } from "../controller/application/get-question-by-application";
import { submitApplication } from "../controller/application/submit-application";
import {
	validateApplicationSubmit,
	validateCreateQuestionByRole,
} from "../middleware/application/validate-body";
import { checkPermissions } from "../middleware/rabc";

export const applicationRoutes = express.Router();

applicationRoutes.get("/get-application-question", getQuestionByApplication);
applicationRoutes.post(
	"/submit-application",
	validateApplicationSubmit,
	submitApplication,
);
applicationRoutes.post(
	"/create-question-by-role",
	checkPermissions(["create:application-question"]),
	validateCreateQuestionByRole,
	createQuestionByRole,
);
