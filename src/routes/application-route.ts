import express from "express";
import { getQuestionByRole } from "../controller/application/get-question-by-role";
import { submitApplication } from "../controller/application/submit-application";
import { validateApplicationSubmit } from "../middleware/application/validate-body";

export const applicationRoutes = express.Router();

applicationRoutes.get("/get-application-question", getQuestionByRole);
applicationRoutes.post(
	"/submit-application",
	validateApplicationSubmit,
	submitApplication,
);
