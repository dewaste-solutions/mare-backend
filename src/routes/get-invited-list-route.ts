import express from "express";
import { getInvitedList } from "../controller/application/get-invited-list";
import { checkPermissions } from "../middleware/rabc";

export const getinvitedRoute = express.Router();

getinvitedRoute.get(
	"/invited-list",
	checkPermissions(["read:invited-list"]),
	getInvitedList,
);
