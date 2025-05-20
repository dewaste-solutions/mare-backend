import { eq } from "drizzle-orm";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { db } from "../../db";
import {
	permissions,
	refreshTokens,
	rolePermissionConnection,
	roles,
	sessions,
	users,
} from "../../db/schema/auth";
import { env } from "../../env";
import { isRefreshTokenValidated } from "../../helper/auth/validate-token";

export const getAccessToken = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const refreshTokenCookies = req.cookies.refreshToken;
		const { isTokenValid } = await isRefreshTokenValidated({
			refreshToken: refreshTokenCookies,
			returnDecoded: false,
		});
		if (!refreshTokenCookies || !isTokenValid) {
			res.status(401).json({ message: "Unauthorized" });
			return;
		}

		const sessionRecord = await db
			.select({
				revoked: refreshTokens.revoked,
				sessionId: refreshTokens.sessionId,
				userId: sessions.userId,
			})
			.from(refreshTokens)
			.innerJoin(sessions, eq(refreshTokens.sessionId, sessions.id))
			.where(eq(refreshTokens.token, refreshTokenCookies))
			.limit(1);

		if (sessionRecord.length === 0 || sessionRecord[0].revoked) {
			res.status(401).json({ message: "Unauthorized" });
			return;
		}

		// Get user and permissions
		const existingUser = await db
			.select({
				id: users.id,
				roleId: users.roleId,
			})
			.from(users)
			.leftJoin(roles, eq(users.roleId, roles.id))
			.where(eq(users.id, sessionRecord[0].userId))
			.limit(1);

		if (existingUser.length === 0) {
			res.status(401).json({ message: "Unauthorized" });
			return;
		}

		const permissionList = await db
			.select({ scope: permissions.scope })
			.from(rolePermissionConnection)
			.innerJoin(
				permissions,
				eq(rolePermissionConnection.permissionId, permissions.id),
			)
			.where(eq(rolePermissionConnection.roleId, existingUser[0].roleId));

		if (permissionList.length === 0) {
			res.status(403).json({ message: "Forbidden: Insufficient permissions" });
			return;
		}

		const permissionsArray = permissionList.map((p) => p.scope);
		const hasPermission = permissionsArray.includes("generate:access-token");
		if (!hasPermission) {
			res.status(403).json({ message: "Forbidden: Insufficient permissions" });
			return;
		}

		const privateKey = env.BACKEND_AUTH_PRIVATE_KEY;

		// Generate new access token
		const accessToken = jwt.sign(
			{
				userId: existingUser[0].id,
				permission: permissionsArray,
			},
			privateKey,
			{ expiresIn: "1d", algorithm: "HS256" },
		);

		res.status(200).json({
			message: "Access token generated successfully",
			data: accessToken,
		});
	} catch (error) {
		next(error);
	}
};
