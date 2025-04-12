import { sql } from "drizzle-orm";
import type { NextFunction, Request, Response } from "express";
import { db } from "../../db";

export const getCurrentDate = async (
	_req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const dateNowResult = await db.execute(
			sql`SELECT NOW() AS current_timestamp`,
		);
		const timeZoneResult = await db.execute(sql`SHOW TIMEZONE`);

		const currentDate = dateNowResult.rows[0].current_timestamp;
		const timeZone = Object.values(timeZoneResult.rows[0])[0];

		res.status(200).json({
			message: "Current date fetched successfully",
			data: { currentDate, timeZone },
		});
		return;
	} catch (error) {
		next(error);
	}
};
