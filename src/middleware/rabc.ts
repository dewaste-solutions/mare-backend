import { eq } from "drizzle-orm";
import type { NextFunction, Request, Response } from "express";
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
				res.status(401).json({ message: "Unauthorized: Missing access token" });
				return;
			}

			const { isTokenValid: isAccessTokenValid, decodedAccessToken } =
				await isAccessTokenValidated({ accessToken, returnDecoded: true });

			if (!isAccessTokenValid || !decodedAccessToken) {
				res.status(401).json({ message: "Unauthorized: Invalid access token" });
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
					.status(401)
					.json({ message: "Unauthorized: Missing refresh token" });
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
				res.status(401).json({ message: "Unauthorized: Invalid session" });
				return;
			}

			if (
				typeof decodedAccessToken !== "object" ||
				decodedAccessToken === null ||
				!decodedAccessToken.permission
			) {
				res.status(401).json({ message: "Unauthorized: Invalid token format" });
				return;
			}

			const userPermissions: string[] = decodedAccessToken.permission;
			const hasPermission = requiredPermissions.every((perm) =>
				userPermissions.includes(perm),
			);

			if (!hasPermission) {
				res
					.status(403)
					.json({ message: "Forbidden: Insufficient permissions" });
				return;
			}

			next();
		} catch (error) {
			next(error);
		}
	};
};
