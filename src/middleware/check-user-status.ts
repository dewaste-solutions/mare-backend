import { eq } from "drizzle-orm";
import type { NextFunction, Request, Response } from "express";
import * as HttpStatusCodes from "../constant/http-status-codes";
import * as HttpStatusPhrases from "../constant/http-status-phrases";
import { db } from "../db";
import { users } from "../db/schema/auth";
import { isRefreshTokenValidated } from "../helper/auth/validate-token";

type RequiredStatusType =
	| "pending_approval"
	| "verified"
	| "suspended"
	| "deactivated";

type DecodedRefreshTokenType = {
	userId: string;
	sessionId: string;
};

export const checkUserStatus = (requiredStatus: RequiredStatusType) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			// no need to check the access token because this middleware will always be partner with rabc.ts

			// get the decoded refresh token
			const refreshTokenCookies = req.cookies.refreshToken;
			const { isTokenValid: isRefreshTokenValid, decodedRefreshToken } =
				await isRefreshTokenValidated({
					refreshToken: refreshTokenCookies,
					returnDecoded: true,
				});
			if (!refreshTokenCookies || !isRefreshTokenValid) {
				res
					.status(HttpStatusCodes.UNAUTHORIZED)
					.json({ message: HttpStatusPhrases.UNAUTHORIZED });
				return;
			}
			const decoded = decodedRefreshToken as DecodedRefreshTokenType;

			const userRecord = await db
				.select({ status: users.status })
				.from(users)
				.where(eq(users.id, decoded.userId))
				.limit(1);

			if (userRecord[0].status !== requiredStatus) {
				res.status(HttpStatusCodes.FORBIDDEN).json({
					message: HttpStatusPhrases.FORBIDDEN,
				});
				return;
			}

			next();
		} catch (error) {
			next(error);
		}
	};
};
