import express from "express";

import { getCurrentDate } from "../controller/common/get-current-date";

export const commonRoute = express.Router();

commonRoute.get("/get-current-date", getCurrentDate);
