import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { eq, sql } from "drizzle-orm";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import * as HttpStatusCodes from "../../constant/http-status-codes";
import * as HttpStatusPhrases from "../../constant/http-status-phrases";
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

export async function signInUser(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		const { email, password } = req.body;
		const ipAddress = (
			req.headers["x-forwarded-for"] ||
			req.socket.remoteAddress ||
			"unknown"
		).toString();
		const userAgent = req.headers["user-agent"] || "unknown";

		// Check if email is exist
		const existingUser = await db
			.select({
				id: users.id,
				encryptedPassword: users.encryptedPassword,
				roleId: users.roleId,
			})
			.from(users)
			.leftJoin(roles, eq(users.roleId, roles.id))
			.where(eq(users.email, email))
			.limit(1);

		// Prevent timing attacks
		if (existingUser.length === 0) {
			const fakePassword = crypto.randomBytes(32).toString("hex");
			await bcrypt.hash(fakePassword, 10);
			res
				.status(HttpStatusCodes.UNAUTHORIZED)
				.json({ message: HttpStatusPhrases.UNAUTHORIZED });
			return;
		}

		// Check if password is correct
		const passwordResult = await bcrypt.compare(
			password,
			existingUser[0].encryptedPassword,
		);
		// if not password is not correct then return invalid input
		if (!passwordResult) {
			res
				.status(HttpStatusCodes.UNAUTHORIZED)
				.json({ message: HttpStatusPhrases.UNAUTHORIZED });
			return;
		}

		// get the permission list based on the roleId
		// users must have a role in default
		const permissionList = await db
			.select({ scope: permissions.scope })
			.from(rolePermissionConnection)
			.innerJoin(
				permissions,
				eq(rolePermissionConnection.permissionId, permissions.id),
			)
			.where(eq(rolePermissionConnection.roleId, existingUser[0].roleId));

		// if the permission list is empty then return internal server error
		if (permissionList.length === 0) {
			res
				.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
				.json({ message: HttpStatusPhrases.INTERNAL_SERVER_ERROR });
			return;
		}
		const permissionsArray = permissionList.map((p) => p.scope);

		const privateKey = env.BACKEND_AUTH_PRIVATE_KEY;
		let refreshToken: string | null = null;

		try {
			await db.transaction(async (tx) => {
				const nowResult = await db.execute(
					sql`SELECT NOW() AS current_timestamp`,
				);
				const now = new Date(nowResult.rows[0].current_timestamp as string);

				const newSession = await tx
					.insert(sessions)
					.values({
						userId: existingUser[0].id,
						updatedAt: now,
						ipAddress,
						userAgent,
						refreshAt: now,
					})
					.returning({ id: sessions.id });

				if (newSession.length === 0) {
					res
						.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
						.json({ message: HttpStatusPhrases.INTERNAL_SERVER_ERROR });
					return;
				}

				const sessionId = newSession[0].id;

				refreshToken = jwt.sign(
					{
						userId: existingUser[0].id,
						sessionId: sessionId,
					},
					privateKey,
					{ expiresIn: "7d", algorithm: "HS256" },
				);

				await tx
					.insert(refreshTokens)
					.values({
						sessionId: sessionId,
						token: refreshToken,
						updatedAt: now,
					})
					.returning({ id: refreshTokens.id });
			});
		} catch (error) {
			next(error);
		}

		// Generate access token
		const accessToken = jwt.sign(
			{
				userId: existingUser[0].id,
				permission: permissionsArray,
			},
			privateKey,
			{ expiresIn: "1d", algorithm: "HS256" },
		);

		// Set refresh token cookie
		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			secure: true,
			sameSite: "strict",
			maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
		});
		// return the access token in the response
		res
			.status(HttpStatusCodes.OK)
			.json({ message: HttpStatusPhrases.OK, data: accessToken });
		return;
	} catch (error) {
		next(error);
	}
}

// access token = 1 day
// refresh token = 1 week
// invite token = 1 week
