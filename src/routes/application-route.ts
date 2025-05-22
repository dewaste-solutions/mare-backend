import express from "express";
import { getQuestionByRole } from "../controller/application/get-question-by-role";
import { submitApplication } from "../controller/application/submit-application";
import { updateApplicationStatus } from "../controller/application/update-application-status";
import { validateApplicationSubmit } from "../middleware/application/validate-body";
import { checkPermissions } from "../middleware/rabc";
import { getApplicationDetails } from "../controller/application/get-application-list";
import { getApplicationDetailsById } from "../controller/application/get-application-details";

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
applicationRoutes.get(
	"/list",
	checkPermissions(["read:application"]),
	getApplicationDetails,
);
applicationRoutes.get(
	"/details",
	checkPermissions(["read:application"]),
	getApplicationDetailsById,
);
