import { eq } from "drizzle-orm";
import type { NextFunction, Request, Response } from "express";
import * as HttpStatusCodes from "../../constant/http-status-codes";
import * as HttpStatusPhrases from "../../constant/http-status-phrases";
import { db } from "../../db";
import { refreshTokens, sessions } from "../../db/schema/auth";
import { decryptToken } from "../../helper/auth/validate-token";

export const signoutUser = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const token = req.cookies.refreshToken;

		// Check if token is present
		if (!token) {
			res
				.status(HttpStatusCodes.UNAUTHORIZED)
				.json({ message: HttpStatusPhrases.UNAUTHORIZED });
			return;
		}

		// Decrypt token
		const decodeToken = await decryptToken(token);
		// Check if token is valid
		if (!decodeToken) {
			res
				.status(HttpStatusCodes.UNAUTHORIZED)
				.json({ message: HttpStatusPhrases.UNAUTHORIZED });
			return;
		}

		const tokenRecord = await db
			.select({
				sessionId: refreshTokens.sessionId,
				tokenId: refreshTokens.id,
			})
			.from(refreshTokens)
			.innerJoin(sessions, eq(refreshTokens.sessionId, sessions.id))
			.where(eq(refreshTokens.token, token))
			.limit(1);

		// Check if token is present
		if (tokenRecord.length === 0) {
			res
				.status(HttpStatusCodes.NOT_FOUND)
				.json({ message: HttpStatusPhrases.NOT_FOUND });
			return;
		}

		const result = await db
			.update(refreshTokens)
			.set({ revoked: true })
			.where(eq(refreshTokens.id, tokenRecord[0].tokenId));

		if (result.rowCount === 0) {
			res
				.status(HttpStatusCodes.BAD_REQUEST)
				.json({ message: HttpStatusPhrases.BAD_REQUEST });
			return;
		}

		res.clearCookie("refreshToken");
		res.status(HttpStatusCodes.OK).json({ message: HttpStatusPhrases.OK });
		return;
	} catch (error) {
		next(error);
	}
};
