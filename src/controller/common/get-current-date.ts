import { sql } from "drizzle-orm";
import type { Request, Response } from "express";
import { db } from "../../db";

export const getCurrentDate = async (
	_req: Request,
	res: Response,
): Promise<void> => {
	try {
		const dateNowResult = await db.execute(
			sql`SELECT NOW() AS current_timestamp`,
		);
		const timeZoneResult = await db.execute(sql`SHOW TIMEZONE`);

		const currentDate = dateNowResult.rows[0].current_timestamp;
		const timeZone = Object.values(timeZoneResult.rows[0])[0];

		res.status(200).json({ currentDate, timeZone });
		return;
	} catch (_error) {
		res.status(500).json({ message: "Internal server error" });
		return;
	}
};
