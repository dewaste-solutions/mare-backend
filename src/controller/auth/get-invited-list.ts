import type { Request, Response } from "express";
import { db } from "../../db/index";
import { invitedUsers } from "../../db/schema/auth";

export const getInvitedList = async (_req: Request, res: Response) => {
	try {
		// Fetch all invited users from the database
		const invitedList = await db.select().from(invitedUsers);

		// Return the list of invited users
		res.status(200).json({
			success: true,
			message: "Invited list fetched successfully",
			data: invitedList,
		});
	} catch (_error) {
		// Log the error and return a failure response
		// console.error("Error fetching invited users:", error);
		res.status(500).json({
			success: false,
			message: "Failed to fetch invited users.",
		});
	}
};
