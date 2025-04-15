import express from "express";
import { getQuestionByRole } from "../controller/application/get-question-by-role";

export const applicationRoutes = express.Router();

applicationRoutes.get("/get-application-question", getQuestionByRole);
