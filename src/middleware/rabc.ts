import { eq } from "drizzle-orm";
import type { NextFunction, Request, Response } from "express";
import * as HttpStatusCodes from "../../src/constant/http-status-codes";
import * as HttpStatusPhrases from "../../src/constant/http-status-phrases";
import { db } from "../db";
import { refreshTokens, sessions } from "../db/schema/auth";
import {
	isAccessTokenValidated,
	isRefreshTokenValidated,
} from "../helper/auth/validate-token";

// <verb>:<resource>
// Common verbs include "read", "write", "create", "update", "delete", "approve", "invite",
// Resources can include specific entities, data types, or functionalities (e.g., "users", "products", "orders", "settings").

/**
 * Middleware to enforce role-based access control (RBAC).
 *
 * - Validates the access token.
 * - Validates the refresh token, including revocation status.
 * - Confirms the user has the required permissions.
 *
 * @param requiredPermissions - List of required permission scopes (e.g., `["read:profile"]`).
 * @returns Express middleware function that enforces RBAC.
 *
 * @example
 * ```ts
 * authRoutes.get("/profile", checkPermissions(["read:profile"]), getProfile);
 * ```
 */
export const checkPermissions = (requiredPermissions: string[]) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			const authHeader = req.headers.authorization;
			const accessToken = authHeader?.split(" ")[1];
			if (!accessToken) {
				res
					.status(HttpStatusCodes.UNAUTHORIZED)
					.json({ message: HttpStatusPhrases.UNAUTHORIZED });
				return;
			}

			const { isTokenValid: isAccessTokenValid, decodedAccessToken } =
				await isAccessTokenValidated({ accessToken, returnDecoded: true });

			if (!isAccessTokenValid || !decodedAccessToken) {
				res
					.status(HttpStatusCodes.UNAUTHORIZED)
					.json({ message: HttpStatusPhrases.UNAUTHORIZED });
				return;
			}

			const refreshTokenCookies = req.cookies.refreshToken;
			const { isTokenValid: isRefreshTokenValid } =
				await isRefreshTokenValidated({
					refreshToken: refreshTokenCookies,
					returnDecoded: false,
				});

			if (!refreshTokenCookies || !isRefreshTokenValid) {
				res
					.status(HttpStatusCodes.UNAUTHORIZED)
					.json({ message: HttpStatusPhrases.UNAUTHORIZED });
				return;
			}

			const sessionRecord = await db
				.select({
					revoked: refreshTokens.revoked,
					sessionId: refreshTokens.sessionId,
				})
				.from(refreshTokens)
				.innerJoin(sessions, eq(refreshTokens.sessionId, sessions.id))
				.where(eq(refreshTokens.token, refreshTokenCookies))
				.limit(1);

			if (sessionRecord.length === 0 || sessionRecord[0].revoked) {
				res
					.status(HttpStatusCodes.UNAUTHORIZED)
					.json({ message: HttpStatusPhrases.UNAUTHORIZED });
				return;
			}

			if (
				typeof decodedAccessToken !== "object" ||
				decodedAccessToken === null ||
				!decodedAccessToken.permission
			) {
				res
					.status(HttpStatusCodes.UNAUTHORIZED)
					.json({ message: HttpStatusPhrases.UNAUTHORIZED });
				return;
			}

			const userPermissions: string[] = decodedAccessToken.permission;
			const hasPermission = requiredPermissions.every((perm) =>
				userPermissions.includes(perm),
			);

			if (!hasPermission) {
				res
					.status(HttpStatusCodes.FORBIDDEN)
					.json({ message: HttpStatusPhrases.FORBIDDEN });
				return;
			}

			next();
		} catch (error) {
			next(error);
		}
	};
};
