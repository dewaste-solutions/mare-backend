import { eq } from "drizzle-orm";
import type { NextFunction, Request, Response } from "express";
import * as HttpStatusCodes from "../../constant/http-status-codes";
import * as HttpStatusPhrases from "../../constant/http-status-phrases";
import { db } from "../../db";
import { refreshTokens } from "../../db/schema/auth";

export const signoutUser = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const token = req.cookies.refreshToken;

		res.clearCookie("refreshToken");

		if (!token) {
			res.status(HttpStatusCodes.OK).json({ message: HttpStatusPhrases.OK });
			return;
		}

		const result = await db
			.update(refreshTokens)
			.set({ revoked: true })
			.where(eq(refreshTokens.token, token));

		if (result.rowCount === 0) {
			res.status(HttpStatusCodes.OK).json({ message: HttpStatusPhrases.OK });
			return;
		}

		res.status(HttpStatusCodes.OK).json({ message: HttpStatusPhrases.OK });
		return;
	} catch (error) {
		next(error);
	}
};
