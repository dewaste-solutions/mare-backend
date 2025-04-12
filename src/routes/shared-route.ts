import express from "express";

import { getCurrentDate } from "../controller/shared/get-current-date";

export const sharedRoute = express.Router();

sharedRoute.get("/get-current-date", getCurrentDate);
