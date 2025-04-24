import express from "express";
import { getQuestionByRole } from "../controller/application/get-question-by-role";
import { submitApplication } from "../controller/application/submit-application";
import { updateApplicationStatus } from "../controller/application/update-application-status";
import { validateApplicationSubmit } from "../middleware/application/validate-body";
import { checkPermissions } from "../middleware/rabc";

export const applicationRoutes = express.Router();

applicationRoutes.get("/get-application-question", getQuestionByRole);
applicationRoutes.post(
	"/submit-application",
	validateApplicationSubmit,
	submitApplication,
);
applicationRoutes.patch(
	"/status",
	checkPermissions(["update:status"]),
	updateApplicationStatus,
);
